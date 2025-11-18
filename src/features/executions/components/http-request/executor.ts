import { NodeExecutor } from '@/features/types';
import { NonRetriableError } from 'inngest';
import ky, { Options as KyOptions } from 'ky';

type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  context,
  data,
  step,
}) => {
  if (!data.endpoint) {
    throw new NonRetriableError('HTTP Request node: No endpoint configured');
  } else if (!data.variableName) {
    throw new NonRetriableError('Variable name not configured');
  }

  const result = await step.run('http-request', async () => {
    const endpoint = data.endpoint!;
    const method = data.method ?? 'GET';

    const headers = new Headers();

    const options: KyOptions = {
      method,
      headers,
    };

    if (['POST', 'PUT', 'PATCH'].includes(method) && data.body) {
      headers.set('Content-Type', 'application/json');
      options.body = data.body;
    }

    const response = await ky(endpoint, options);

    const contentType = response.headers.get('content-type');
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

    if (data.variableName) {
      return {
        ...context,
        [data.variableName]: responsePayload,
      };
    }

    return {
      ...context,
      ...responsePayload,
    };
  });

  return result;
};
