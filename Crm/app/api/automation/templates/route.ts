import { NextResponse } from 'next/server';
import { 
  getAllTemplates, 
  getTemplateById, 
  getTemplatesByCategory, 
  createWorkflowFromTemplate 
} from '@/lib/services/workflow-templates';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SUPABASE_CONFIG } from '@/lib/supabase/config';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    
    if (id) {
      // Get a specific template by ID
      const template = getTemplateById(id);
      
      if (!template) {
        return NextResponse.json(
          { error: 'Template not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(template);
    } else if (category) {
      // Get templates by category
      const templates = getTemplatesByCategory(category);
      return NextResponse.json(templates);
    } else {
      // Get all templates
      const templates = getAllTemplates();
      return NextResponse.json(templates);
    }
  } catch (error) {
    console.error('Error fetching workflow templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflow templates', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { templateId, name, description } = await request.json();
    
    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }
    
    // Create a workflow from the template
    const workflow = createWorkflowFromTemplate(templateId);
    
    // Override name and description if provided
    if (name) workflow.name = name;
    if (description) workflow.description = description;
    
    // Create Supabase client
    const cookieStore = cookies();
    const supabase = createServerClient(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name, options) {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 });
          }
        }
      }
    );
    
    const { data, error } = await supabase
      .from('automation_workflows')
      .insert([{
        name: workflow.name,
        description: workflow.description,
        is_active: workflow.is_active,
        graph_json: JSON.stringify({
          nodes: workflow.nodes,
          connections: workflow.connections,
          triggers: workflow.triggers,
        }),
      }])
      .select();
    
    if (error) {
      console.error('Error creating workflow from template:', error);
      return NextResponse.json(
        { error: 'Failed to create workflow from template', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      workflow: data[0],
    });
  } catch (error) {
    console.error('Error creating workflow from template:', error);
    return NextResponse.json(
      { error: 'Failed to create workflow from template', details: String(error) },
      { status: 500 }
    );
  }
}