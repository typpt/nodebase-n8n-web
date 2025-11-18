import { NodeExecutor } from '@/features/types';
import { NonRetriableError } from 'inngest';
import ky, { Options as KyOptions } from 'ky';

type HttpRequestData = {
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

    return {
      ...context,
      httpResponse: {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };
  });

  return result;
};
