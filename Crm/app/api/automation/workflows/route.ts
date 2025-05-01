import { createRouteClient } from '@/lib/supabase/route'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createRouteClient()

  if (!supabase) {
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
  }

  const { data, error } = await supabase
    .from('automation_workflows')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { name, description, is_active, graph_json } = await request.json()

  // Validate required fields
  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  // Prepare the graph JSON
  let graphJsonString = graph_json
  if (typeof graph_json === 'object') {
    graphJsonString = JSON.stringify(graph_json)
  }

  const { data, error } = await supabase
    .from('automation_workflows')
    .insert([{
      name,
      description,
      is_active: is_active !== undefined ? is_active : true,
      graph_json: graphJsonString
    }])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data[0])
}

export async function PUT(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { id, name, description, is_active, graph_json } = await request.json()

  // Validate required fields
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  // Prepare the graph JSON
  let graphJsonString = graph_json
  if (typeof graph_json === 'object') {
    graphJsonString = JSON.stringify(graph_json)
  }

  const { data, error } = await supabase
    .from('automation_workflows')
    .update({
      name,
      description,
      is_active: is_active !== undefined ? is_active : true,
      graph_json: graphJsonString,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data[0])
}