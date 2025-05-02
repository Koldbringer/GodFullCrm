"use client";

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import {
  Brain,
  Lightbulb,
  RefreshCw,
  Sparkles,
  Zap
} from 'lucide-react';

/**
 * MCP AI Insights Panel
 * Uses Mastra MCP with OpenAI to provide AI-powered insights
 */
export function MCPAiInsightsPanel() {
  const [prompt, setPrompt] = useState('');
  const [data, setData] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('prompt');

  /**
   * Handle the analysis request
   */
  const handleAnalysis = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a prompt for the AI analysis',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Parse the data if provided
      let parsedData;
      if (data.trim()) {
        try {
          parsedData = JSON.parse(data);
        } catch (e) {
          // If not valid JSON, use as string
          parsedData = data;
        }
      }

      // Call the AI analysis API
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          data: parsedData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to perform AI analysis');
      }

      const result = await response.json();
      setResult(result.result);
      setActiveTab('result');

      toast({
        title: 'Analysis Complete',
        description: 'AI analysis completed successfully',
      });
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

  /**
   * Render the analysis result
   */
  const renderResult = () => {
    if (!result) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No analysis result yet</p>
          <Button onClick={() => setActiveTab('prompt')}>
            Create Analysis
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {result.summary && (
          <div>
            <h3 className="text-sm font-medium mb-2">Summary</h3>
            <p className="text-sm">{result.summary}</p>
          </div>
        )}

        {result.insights && result.insights.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Insights</h3>
            <ul className="space-y-1">
              {result.insights.map((insight: string, index: number) => (
                <li key={index} className="text-sm flex items-start gap-2 hover:bg-muted/30 p-1 rounded-md transition-colors">
                  <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="flex-1">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.recommendations && result.recommendations.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Recommendations</h3>
            <ul className="space-y-1">
              {result.recommendations.map((rec: string, index: number) => (
                <li key={index} className="text-sm flex items-start gap-2 hover:bg-muted/30 p-1 rounded-md transition-colors">
                  <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="flex-1">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.metrics && Object.keys(result.metrics).length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Metrics</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(result.metrics).map(([key, value]: [string, any]) => (
                <div key={key} className="bg-muted/50 p-2 rounded hover:bg-muted/70 transition-colors shadow-sm">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">{key}</div>
                  <div className="font-medium">
                    {typeof value === 'object' 
                      ? JSON.stringify(value) 
                      : typeof value === 'number' && value < 1 
                        ? (value * 100).toFixed(1) + '%' 
                        : value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.timeTrends && result.timeTrends.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Time Trends</h3>
            <div className="relative h-40 w-full">
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-32">
                {result.timeTrends.map((point: any, index: number) => {
                  const maxValue = Math.max(...result.timeTrends.map((p: any) => p.value || p.count || 0));
                  const value = point.value || point.count || 0;
                  const height = maxValue > 0 ? (value / maxValue) * 100 : 0;

                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-8 bg-primary/80 rounded-t transition-all duration-300 hover:bg-primary"
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="text-xs mt-1">{point.period}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Fallback for raw response */}
        {(!result.insights && !result.recommendations && !result.metrics && !result.timeTrends && !result.summary) && (
          <div>
            <h3 className="text-sm font-medium mb-2">Raw Response</h3>
            <pre className="text-xs bg-muted/50 p-2 rounded overflow-auto max-h-60">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          MCP AI Insights
        </CardTitle>
        <CardDescription>
          AI-powered insights using Mastra MCP with OpenAI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="prompt">Prompt</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="result">Result</TabsTrigger>
          </TabsList>
          
          <TabsContent value="prompt" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Analysis Prompt</label>
              <Textarea
                placeholder="Enter your analysis request, e.g., 'Analyze customer spending patterns and identify trends'"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                className="min-h-[150px]"
              />
              <p className="text-xs text-muted-foreground">
                Be specific about what you want to analyze and what insights you're looking for
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button
                onClick={() => setActiveTab('data')}
                disabled={!prompt.trim()}
              >
                Next: Add Data
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="data" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data (Optional JSON)</label>
              <Textarea
                placeholder="Enter JSON data to analyze (optional)"
                value={data}
                onChange={e => setData(e.target.value)}
                className="min-h-[200px] font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use data from the database
              </p>
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveTab('prompt')}
              >
                Back
              </Button>
              
              <Button
                onClick={handleAnalysis}
                disabled={isAnalyzing || !prompt.trim()}
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
            </div>
          </TabsContent>
          
          <TabsContent value="result">
            {renderResult()}
            
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setActiveTab('data')}
              >
                Back
              </Button>
              
              <Button
                onClick={handleAnalysis}
                disabled={isAnalyzing || !prompt.trim()}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Run Again
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Powered by Mastra MCP with OpenAI
        </p>
      </CardFooter>
    </Card>
  );
}