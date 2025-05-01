"use client";

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { 
  AlertTriangle, 
  BarChart3, 
  Brain, 
  Calendar, 
  Clock, 
  Download, 
  Lightbulb, 
  RefreshCw, 
  Search, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Zap 
} from 'lucide-react';

type AiAnalysis = {
  id: string;
  prompt: string;
  response: any;
  created_at: string;
  workflow_execution_id?: string;
};

export function AiInsightsPanel() {
  const [activeTab, setActiveTab] = useState('recent');
  const [analyses, setAnalyses] = useState<AiAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [customData, setCustomData] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  useEffect(() => {
    fetchAnalyses();
  }, []);
  
  const fetchAnalyses = async () => {
    setIsRefreshing(true);
    
    try {
      const response = await fetch('/api/ai/analyze/logs?limit=20');
      
      if (!response.ok) {
        throw new Error('Failed to fetch AI analyses');
      }
      
      const data = await response.json();
      
      // Parse the response JSON for each analysis
      const parsedAnalyses = data.map((analysis: any) => ({
        ...analysis,
        response: typeof analysis.response === 'string' 
          ? JSON.parse(analysis.response) 
          : analysis.response
      }));
      
      setAnalyses(parsedAnalyses);
      setError(null);
    } catch (error) {
      console.error('Error fetching AI analyses:', error);
      setError('Failed to load AI analyses');
      toast({
        title: 'Error',
        description: 'Failed to load AI analyses',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const handleCustomAnalysis = async () => {
    if (!customPrompt.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a prompt for the AI analysis',
        variant: 'destructive',
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Try to parse the custom data as JSON if provided
      let parsedData;
      if (customData.trim()) {
        try {
          parsedData = JSON.parse(customData);
        } catch (e) {
          // If not valid JSON, use as string
          parsedData = customData;
        }
      } else {
        // Default data if none provided
        parsedData = {
          customers: [
            { id: 1, name: "Firma ABC", revenue: 50000, joinedAt: "2023-01-15" },
            { id: 2, name: "XYZ Sp. z o.o.", revenue: 75000, joinedAt: "2022-08-22" },
            { id: 3, name: "Przedsiębiorstwo 123", revenue: 120000, joinedAt: "2021-11-05" }
          ],
          serviceOrders: [
            { id: 101, customerId: 1, type: "Installation", status: "Completed", date: "2023-05-10" },
            { id: 102, customerId: 2, type: "Maintenance", status: "Pending", date: "2023-06-15" },
            { id: 103, customerId: 1, type: "Repair", status: "In Progress", date: "2023-06-02" }
          ]
        };
      }
      
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: customPrompt,
          data: parsedData,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to perform AI analysis');
      }
      
      const result = await response.json();
      
      // Add the new analysis to the list
      setAnalyses(prev => [{
        id: `temp-${Date.now()}`,
        prompt: customPrompt,
        response: result.result,
        created_at: new Date().toISOString(),
      }, ...prev]);
      
      // Clear the form
      setCustomPrompt('');
      setCustomData('');
      
      toast({
        title: 'Analysis Complete',
        description: 'AI analysis completed successfully',
      });
      
      // Switch to the recent tab to show the new analysis
      setActiveTab('recent');
    } catch (error) {
      console.error('Error performing AI analysis:', error);
      toast({
        title: 'Error',
        description: 'Failed to perform AI analysis',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const renderAnalysisContent = (analysis: AiAnalysis) => {
    const response = analysis.response;
    
    if (!response) {
      return <p className="text-muted-foreground">No data available</p>;
    }
    
    // Check if response has insights
    if (response.insights) {
      return (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Insights</h4>
            <ul className="space-y-1">
              {response.insights.map((insight: string, index: number) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {response.recommendations && (
            <div>
              <h4 className="text-sm font-medium mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {response.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {response.metrics && (
            <div>
              <h4 className="text-sm font-medium mb-2">Key Metrics</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(response.metrics).map(([key, value]: [string, any]) => (
                  <div key={key} className="bg-muted/50 p-2 rounded">
                    <div className="text-xs text-muted-foreground">{key}</div>
                    <div className="font-medium">{typeof value === 'number' && value < 1 ? (value * 100).toFixed(1) + '%' : value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    // Check if response has time trends
    if (response.timeTrends) {
      return (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Time Trends</h4>
            <div className="relative h-40 w-full">
              {/* Simple bar chart visualization */}
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-32">
                {response.timeTrends.map((point: any, index: number) => {
                  const maxValue = Math.max(...response.timeTrends.map((p: any) => p.value));
                  const height = (point.value / maxValue) * 100;
                  
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="w-8 bg-primary/80 rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="text-xs mt-1">{point.period}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {response.seasonalPatterns && (
            <div>
              <h4 className="text-sm font-medium mb-2">Seasonal Patterns</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(response.seasonalPatterns).map(([season, pattern]: [string, any]) => (
                  <div key={season} className="bg-muted/50 p-2 rounded">
                    <div className="text-xs font-medium capitalize">{season}</div>
                    <div className="text-sm">{pattern}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {response.forecast && (
            <div>
              <h4 className="text-sm font-medium mb-2">Forecast</h4>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(response.forecast).map(([period, forecast]: [string, any]) => (
                  <div key={period} className="bg-muted/50 p-2 rounded">
                    <div className="text-xs text-muted-foreground capitalize">{period.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div className="text-sm font-medium">{forecast}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    // Generic response format
    if (response.summary || response.keyInsights) {
      return (
        <div className="space-y-4">
          {response.summary && (
            <div>
              <h4 className="text-sm font-medium mb-2">Summary</h4>
              <p className="text-sm">{response.summary}</p>
            </div>
          )}
          
          {response.keyInsights && (
            <div>
              <h4 className="text-sm font-medium mb-2">Key Insights</h4>
              <ul className="space-y-1">
                {response.keyInsights.map((insight: string, index: number) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <Brain className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {response.recommendations && (
            <div>
              <h4 className="text-sm font-medium mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {response.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }
    
    // Fallback for unknown response format
    return (
      <div>
        <h4 className="text-sm font-medium mb-2">Analysis Result</h4>
        <pre className="text-xs bg-muted/50 p-2 rounded overflow-auto max-h-60">
          {JSON.stringify(response, null, 2)}
        </pre>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Analyses
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Custom Analysis
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Business Insights
            </TabsTrigger>
            <TabsTrigger value="customer" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Customer Insights
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchAnalyses}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <TabsContent value="recent" className="mt-0 space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <AlertTriangle className="h-6 w-6 text-destructive mr-2" />
              <p>{error}</p>
            </CardContent>
          </Card>
        ) : analyses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No AI analyses found</p>
              <Button onClick={() => setActiveTab('custom')}>
                Create Custom Analysis
              </Button>
            </CardContent>
          </Card>
        ) : (
          analyses.map(analysis => (
            <Card key={analysis.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center text-lg">
                      <Sparkles className="h-5 w-5 text-primary mr-2" />
                      AI Analysis
                    </CardTitle>
                    <CardDescription>
                      {formatDate(analysis.created_at)}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-1">Prompt</h3>
                  <p className="text-sm text-muted-foreground">{analysis.prompt}</p>
                </div>
                
                <div className="border-t pt-3">
                  {renderAnalysisContent(analysis)}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>
      
      <TabsContent value="custom" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Custom AI Analysis</CardTitle>
            <CardDescription>
              Create a custom AI analysis by providing a prompt and optional data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Analysis Prompt</label>
              <Textarea
                placeholder="Enter your analysis request, e.g., 'Analyze customer spending patterns and identify trends'"
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Data (Optional JSON)</label>
              <Textarea
                placeholder="Enter JSON data to analyze (optional)"
                value={customData}
                onChange={e => setCustomData(e.target.value)}
                className="min-h-[150px] font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use default sample data
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleCustomAnalysis}
              disabled={isAnalyzing || !customPrompt.trim()}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Run Analysis
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="business" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Business Insights</CardTitle>
            <CardDescription>
              AI-powered insights about your business performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm">Revenue Trend</h4>
                    <p className="text-xs text-muted-foreground">
                      Revenue has increased by 18% compared to the previous quarter, with HVAC installations being the primary driver.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm">Seasonal Patterns</h4>
                    <p className="text-xs text-muted-foreground">
                      Service requests peak during summer months (June-August) and winter months (December-February), suggesting opportunity for seasonal promotions.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm">Customer Segmentation</h4>
                    <p className="text-xs text-muted-foreground">
                      20% of customers generate 65% of revenue. Focus retention efforts on these high-value customers.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Brain className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm">AI Recommendations</h4>
                    <p className="text-xs text-muted-foreground">
                      Increase technician availability during peak seasons and implement a customer loyalty program for high-value clients.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-3">Performance Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/50 p-3 rounded">
                  <div className="text-xs text-muted-foreground">Average Order Value</div>
                  <div className="text-lg font-bold">$1,250</div>
                  <div className="text-xs text-green-500">↑ 12%</div>
                </div>
                
                <div className="bg-muted/50 p-3 rounded">
                  <div className="text-xs text-muted-foreground">Customer Retention</div>
                  <div className="text-lg font-bold">78%</div>
                  <div className="text-xs text-green-500">↑ 5%</div>
                </div>
                
                <div className="bg-muted/50 p-3 rounded">
                  <div className="text-xs text-muted-foreground">Service Completion Rate</div>
                  <div className="text-lg font-bold">92%</div>
                  <div className="text-xs text-green-500">↑ 3%</div>
                </div>
                
                <div className="bg-muted/50 p-3 rounded">
                  <div className="text-xs text-muted-foreground">Customer Satisfaction</div>
                  <div className="text-lg font-bold">4.7/5</div>
                  <div className="text-xs text-green-500">↑ 0.2</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('custom')}>
              Generate Custom Business Analysis
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="customer" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
            <CardDescription>
              AI-powered insights about your customer behavior and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Customer Segments</h3>
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="Search customers..." 
                  className="w-60 h-8"
                />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Residential Customers</CardTitle>
                  <CardDescription>42% of customer base</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Prefer weekend service appointments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Most sensitive to pricing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Highest response to seasonal promotions</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Commercial Clients</CardTitle>
                  <CardDescription>35% of customer base</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Value rapid response times</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Prefer service contracts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Higher average order value</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Industrial Clients</CardTitle>
                  <CardDescription>23% of customer base</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Require specialized technicians</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Longest customer relationships</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Most likely to recommend services</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-3">Customer Behavior Insights</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm">Repeat Business Patterns</h4>
                    <p className="text-xs text-muted-foreground">
                      Customers who schedule preventive maintenance are 3.5x more likely to return for additional services within 12 months.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm">Communication Preferences</h4>
                    <p className="text-xs text-muted-foreground">
                      Email is preferred by 65% of customers, while 28% prefer SMS and 7% prefer phone calls. Response rates are highest for SMS (42% response within 1 hour).
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm">Service Upgrade Opportunities</h4>
                    <p className="text-xs text-muted-foreground">
                      Customers with systems older than 8 years are most receptive to upgrade offers, especially when presented with energy efficiency comparisons.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('custom')}>
              Generate Custom Customer Analysis
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </div>
  );
}
