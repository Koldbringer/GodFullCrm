import { NextResponse } from 'next/server';
import { processScheduleTriggers } from '@/lib/services/workflow-triggers';

export async function POST(request: Request) {
  try {
    // This endpoint should be called by a cron job or scheduler
    // It processes all scheduled triggers and executes workflows if needed
    await processScheduleTriggers();
    
    return NextResponse.json({
      success: true,
      message: 'Schedule triggers processed successfully',
    });
  } catch (error) {
    console.error('Error processing schedule triggers:', error);
    return NextResponse.json(
      { error: 'Failed to process schedule triggers', details: String(error) },
      { status: 500 }
    );
  }
}
