// Endpoint for Microsoft domain verification
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  // Hardcoded response for Microsoft identity verification
  const response = {
    "associatedApplications": [
      {
        "applicationId": "YOUR_MICROSOFT_APPLICATION_ID"
      }
    ]
  };
  
  return NextResponse.json(response, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
