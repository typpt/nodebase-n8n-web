import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { inngest } from './client';

const google = createGoogleGenerativeAI();

export const execute = inngest.createFunction(
  { id: 'execute' },
  { event: 'execute/ai' },

  async ({ step }) => {
    const { steps } = await step.ai.wrap('gemini-generate-text', generateText, {
      model: google('gemini-2.5-flash'),
      system:
        'You are a helpful AI assistant that writes and explains things clearly and concisely.',
      prompt:
        'Write a short summary of an article about climate change in 3 sentences.',
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

    return steps;
  }
);
