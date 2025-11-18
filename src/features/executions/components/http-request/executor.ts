import { NodeExecutor } from '@/features/types';
import Handlebars from 'handlebars';
import { NonRetriableError } from 'inngest';
import ky, { Options as KyOptions } from 'ky';

type HttpRequestData = {
  variableName: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: string;
};

Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  context,
  data,
  step,
}) => {
  if (!data.endpoint) {
    throw new NonRetriableError('HTTP Request node: No endpoint configured');
  } else if (!data.variableName) {
    throw new NonRetriableError(
      'HTTP Request node: Variable name not configured'
    );
  } else if (!data.method) {
    throw new NonRetriableError('HTTP Request node: Method not configured');
  }

  const result = await step.run('http-request', async () => {
    const endpoint = Handlebars.compile(data.endpoint)(context);
    const method = data.method ?? 'GET';

    const headers = new Headers();

    const options: KyOptions = {
      method,
      headers,
    };

    if (['POST', 'PUT', 'PATCH'].includes(method) && data.body) {
      headers.set('Content-Type', 'application/json');

      const resolved = Handlebars.compile(data.body || '{}')(context);
      JSON.parse(resolved);
      options.body = resolved;
    }

    const response = await ky(endpoint, options);

    const contentType = response.headers.get('Content-Type');
    const responseData = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();
    const responsePayload = {
      httpResponse: {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };

    return {
      ...context,
      [data.variableName]: responsePayload,
    };
  });

  return result;
};
