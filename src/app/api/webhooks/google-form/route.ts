import { sendWorkflowExecution } from '@/integrations/inngest/utils';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get('workflowId');

    if (!workflowId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required query parameter "Workflow ID"',
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const formData = {
      formId: body.formId,
      formTitle: body.formTitle,
      responseId: body.responseId,
      timestamp: body.timestamp,
      respondentEmail: body.respondentEmail,
      response: body.response,
      raw: body,
    };

    await sendWorkflowExecution({
      workflowId,
      initialData: { formData: formData },
    });
  } catch (error) {
    console.error('Google form webhook error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process Goggle Form submission',
      },
      { status: 500 }
    );
  }
}
