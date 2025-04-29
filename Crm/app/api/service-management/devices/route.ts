import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get('customerId');
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const manufacturer = searchParams.get('manufacturer');
  
  try {
    const supabase = createClient();
    
    let query = supabase
      .from('devices')
      .select(`
        *,
        maintenance_schedules(*)
      `);
    
    // Apply filters if provided
    if (customerId) {
      query = query.eq('customer_id', customerId);
    }
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (manufacturer) {
      query = query.ilike('manufacturer', `%${manufacturer}%`);
    }
    
    // Order by name
    query = query.order('name', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching devices:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in devices API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      model,
      serialNumber,
      manufacturer,
      category,
      installationDate,
      warrantyExpiry,
      customerId,
      location,
      status,
      notes,
      maintenanceSchedule
    } = body;
    
    // Validate required fields
    if (!name || !model || !manufacturer || !category || !customerId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const supabase = createClient();
    
    // First, create the device
    const { data, error } = await supabase
      .from('devices')
      .insert([
        {
          name,
          model,
          serial_number: serialNumber,
          manufacturer,
          category,
          installation_date: installationDate,
          warranty_expiry: warrantyExpiry,
          customer_id: customerId,
          location,
          status,
          notes
        }
      ])
      .select();
    
    if (error) {
      console.error('Error creating device:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    const deviceId = data[0].id;
    
    // If maintenance schedule is provided, create it
    if (maintenanceSchedule && maintenanceSchedule.frequency && maintenanceSchedule.nextMaintenanceDate) {
      const { error: scheduleError } = await supabase
        .from('maintenance_schedules')
        .insert([
          {
            device_id: deviceId,
            frequency: maintenanceSchedule.frequency,
            next_maintenance_date: maintenanceSchedule.nextMaintenanceDate,
            maintenance_type: maintenanceSchedule.maintenanceType || 'regular',
            description: maintenanceSchedule.description
          }
        ]);
      
      if (scheduleError) {
        console.error('Error creating maintenance schedule:', scheduleError);
        // Don't fail the whole request if just the schedule fails
      }
    }
    
    return NextResponse.json(data[0]);
  } catch (error: any) {
    console.error('Error in devices API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Device ID is required' },
        { status: 400 }
      );
    }
    
    const supabase = createClient();
    
    // Convert camelCase to snake_case for database fields
    const dbUpdateData: any = {};
    if (updateData.name !== undefined) dbUpdateData.name = updateData.name;
    if (updateData.model !== undefined) dbUpdateData.model = updateData.model;
    if (updateData.serialNumber !== undefined) dbUpdateData.serial_number = updateData.serialNumber;
    if (updateData.manufacturer !== undefined) dbUpdateData.manufacturer = updateData.manufacturer;
    if (updateData.category !== undefined) dbUpdateData.category = updateData.category;
    if (updateData.installationDate !== undefined) dbUpdateData.installation_date = updateData.installationDate;
    if (updateData.warrantyExpiry !== undefined) dbUpdateData.warranty_expiry = updateData.warrantyExpiry;
    if (updateData.customerId !== undefined) dbUpdateData.customer_id = updateData.customerId;
    if (updateData.location !== undefined) dbUpdateData.location = updateData.location;
    if (updateData.status !== undefined) dbUpdateData.status = updateData.status;
    if (updateData.notes !== undefined) dbUpdateData.notes = updateData.notes;
    
    const { data, error } = await supabase
      .from('devices')
      .update(dbUpdateData)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating device:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Device not found' },
        { status: 404 }
      );
    }
    
    // If maintenance schedule is provided, update it
    if (updateData.maintenanceSchedule) {
      const { maintenanceSchedule } = updateData;
      
      // Check if a maintenance schedule exists for this device
      const { data: scheduleData, error: scheduleQueryError } = await supabase
        .from('maintenance_schedules')
        .select('id')
        .eq('device_id', id)
        .limit(1);
      
      if (scheduleQueryError) {
        console.error('Error querying maintenance schedule:', scheduleQueryError);
      } else {
        if (scheduleData && scheduleData.length > 0) {
          // Update existing schedule
          const { error: scheduleUpdateError } = await supabase
            .from('maintenance_schedules')
            .update({
              frequency: maintenanceSchedule.frequency,
              next_maintenance_date: maintenanceSchedule.nextMaintenanceDate,
              maintenance_type: maintenanceSchedule.maintenanceType,
              description: maintenanceSchedule.description
            })
            .eq('id', scheduleData[0].id);
          
          if (scheduleUpdateError) {
            console.error('Error updating maintenance schedule:', scheduleUpdateError);
          }
        } else {
          // Create new schedule
          const { error: scheduleInsertError } = await supabase
            .from('maintenance_schedules')
            .insert([
              {
                device_id: id,
                frequency: maintenanceSchedule.frequency,
                next_maintenance_date: maintenanceSchedule.nextMaintenanceDate,
                maintenance_type: maintenanceSchedule.maintenanceType || 'regular',
                description: maintenanceSchedule.description
              }
            ]);
          
          if (scheduleInsertError) {
            console.error('Error creating maintenance schedule:', scheduleInsertError);
          }
        }
      }
    }
    
    return NextResponse.json(data[0]);
  } catch (error: any) {
    console.error('Error in devices API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { error: 'Device ID is required' },
      { status: 400 }
    );
  }
  
  try {
    const supabase = createClient();
    
    // First delete any maintenance schedules for this device
    const { error: scheduleError } = await supabase
      .from('maintenance_schedules')
      .delete()
      .eq('device_id', id);
    
    if (scheduleError) {
      console.error('Error deleting maintenance schedules:', scheduleError);
      // Continue anyway, as the foreign key constraint will handle this
    }
    
    // Then delete the device
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting device:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in devices API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}