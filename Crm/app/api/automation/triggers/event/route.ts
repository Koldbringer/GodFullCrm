import { NextResponse } from 'next/server';
import { processEventTrigger } from '@/lib/services/workflow-triggers';

export async function POST(request: Request) {
  try {
    const { eventType, eventData } = await request.json();
    
    if (!eventType) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      );
    }
    
    // Process the event trigger
    await processEventTrigger(eventType, eventData || {});
    
    return NextResponse.json({
      success: true,
      message: `Event ${eventType} processed successfully`,
    });
  } catch (error) {
    console.error('Error processing event trigger:', error);
    return NextResponse.json(
      { error: 'Failed to process event trigger', details: String(error) },
      { status: 500 }
    );
  }
}
