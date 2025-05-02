"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { 
  Bot, 
  Calendar, 
  Clock, 
  Copy, 
  FileText, 
  Filter, 
  Package, 
  Plus, 
  Search, 
  ShoppingCart, 
  Users 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type WorkflowTemplate = {
  id: string;
  name: string;
  description: string;
  category: 'customer' | 'service' | 'inventory' | 'reporting' | 'marketing';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  previewImageUrl?: string;
};

export function WorkflowTemplatesGallery() {
  const router = useRouter();
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<WorkflowTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  
  useEffect(() => {
    fetchTemplates();
  }, []);
  
  useEffect(() => {
    filterTemplates();
  }, [templates, searchQuery, selectedCategory]);
  
  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/automation/templates');
      
      if (!response.ok) {
        throw new Error('Failed to fetch workflow templates');
      }
      
      const data = await response.json();
      setTemplates(data);
      setFilteredTemplates(data);
    } catch (error) {
      console.error('Error fetching workflow templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch workflow templates',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const filterTemplates = () => {
    let filtered = [...templates];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(query) || 
        template.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }
    
    setFilteredTemplates(filtered);
  };
  
  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate) return;
    
    setIsCreating(true);
    
    try {
      const response = await fetch('/api/automation/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          name: customName || selectedTemplate.name,
          description: customDescription || selectedTemplate.description,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create workflow from template');
      }
      
      const result = await response.json();
      
      toast({
        title: 'Success',
        description: 'Workflow created successfully',
      });
      
      // Close the dialog
      setIsDialogOpen(false);
      
      // Reset form
      setCustomName('');
      setCustomDescription('');
      
      // Navigate to the workflow editor
      router.push(`/automation?id=${result.workflow.id}`);
    } catch (error) {
      console.error('Error creating workflow from template:', error);
      toast({
        title: 'Error',
        description: 'Failed to create workflow from template',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'customer':
        return <Users className="h-4 w-4" />;
      case 'service':
        return <Bot className="h-4 w-4" />;
      case 'inventory':
        return <Package className="h-4 w-4" />;
      case 'reporting':
        return <FileText className="h-4 w-4" />;
      case 'marketing':
        return <ShoppingCart className="h-4 w-4" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500';
      case 'intermediate':
        return 'bg-yellow-500';
      case 'advanced':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'customer':
        return 'Klienci';
      case 'service':
        return 'Serwis';
      case 'inventory':
        return 'Magazyn';
      case 'reporting':
        return 'Raporty';
      case 'marketing':
        return 'Marketing';
      default:
        return category;
    }
  };
  
  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Początkujący';
      case 'intermediate':
        return 'Średniozaawansowany';
      case 'advanced':
        return 'Zaawansowany';
      default:
        return difficulty;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 w-full">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj szablonów..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={!selectedCategory ? 'border-primary' : ''}
          >
            Wszystkie
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedCategory('customer')}
            className={selectedCategory === 'customer' ? 'border-primary' : ''}
          >
            <Users className="h-4 w-4 mr-2" />
            Klienci
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedCategory('service')}
            className={selectedCategory === 'service' ? 'border-primary' : ''}
          >
            <Bot className="h-4 w-4 mr-2" />
            Serwis
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedCategory('inventory')}
            className={selectedCategory === 'inventory' ? 'border-primary' : ''}
          >
            <Package className="h-4 w-4 mr-2" />
            Magazyn
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      ) : filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Nie znaleziono szablonów</p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCategory(null);
            }}>
              Wyczyść filtry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(template.category)}
                    <Badge variant="outline">
                      {getCategoryLabel(template.category)}
                    </Badge>
                  </div>
                  <Badge className={getDifficultyColor(template.difficulty)}>
                    {getDifficultyLabel(template.difficulty)}
                  </Badge>
                </div>
                <CardTitle className="mt-2">{template.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {template.previewImageUrl ? (
                  <div className="rounded-md overflow-hidden border mb-4">
                    <img 
                      src={template.previewImageUrl} 
                      alt={template.name} 
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ) : (
                  <div className="rounded-md overflow-hidden border mb-4 bg-muted/50 flex items-center justify-center h-32">
                    <Bot className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setSelectedTemplate(template);
                    setCustomName(template.name);
                    setCustomDescription(template.description);
                    setIsDialogOpen(true);
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Użyj szablonu
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Utwórz przepływ z szablonu</DialogTitle>
            <DialogDescription>
              Dostosuj nazwę i opis przepływu pracy lub użyj domyślnych wartości z szablonu.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nazwa przepływu</Label>
              <Input
                id="name"
                placeholder="Nazwa przepływu"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Opis</Label>
              <Textarea
                id="description"
                placeholder="Opis przepływu"
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            {selectedTemplate && (
              <div className="rounded-md bg-muted p-3 text-sm">
                <p className="font-medium mb-1">Informacje o szablonie:</p>
                <p><span className="font-medium">Kategoria:</span> {getCategoryLabel(selectedTemplate.category)}</p>
                <p><span className="font-medium">Poziom trudności:</span> {getDifficultyLabel(selectedTemplate.difficulty)}</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Anuluj
            </Button>
            <Button 
              onClick={handleCreateFromTemplate}
              disabled={isCreating}
            >
              {isCreating ? 'Tworzenie...' : 'Utwórz przepływ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
