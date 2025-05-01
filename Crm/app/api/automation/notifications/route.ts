import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { 
  getAutomationNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification
} from '@/lib/services/automation-notifications';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const includeRead = searchParams.get('includeRead') === 'true';
    
    const notifications = await getAutomationNotifications(limit, offset, includeRead);
    
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching automation notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch automation notifications', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { workflowId, workflowName, executionId, message, status } = await request.json();
    
    if (!workflowId || !workflowName || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: workflowId, workflowName, message' },
        { status: 400 }
      );
    }
    
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data, error } = await supabase.from('automation_notifications').insert({
      workflow_id: workflowId,
      workflow_name: workflowName,
      execution_id: executionId || null,
      message,
      status: status || 'info',
      read: false,
    }).select();
    
    if (error) {
      console.error('Error creating automation notification:', error);
      return NextResponse.json(
        { error: 'Failed to create automation notification', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      notification: data[0],
    });
  } catch (error) {
    console.error('Error creating automation notification:', error);
    return NextResponse.json(
      { error: 'Failed to create automation notification', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const markAll = searchParams.get('markAll') === 'true';
    
    if (markAll) {
      const success = await markAllNotificationsAsRead();
      
      if (!success) {
        return NextResponse.json(
          { error: 'Failed to mark all notifications as read' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read',
      });
    }
    
    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }
    
    const success = await markNotificationAsRead(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to mark notification as read' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    console.error('Error updating automation notification:', error);
    return NextResponse.json(
      { error: 'Failed to update automation notification', details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }
    
    const success = await deleteNotification(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete notification' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error) {
    console.error('Error deleting automation notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete automation notification', details: String(error) },
      { status: 500 }
    );
  }
}
