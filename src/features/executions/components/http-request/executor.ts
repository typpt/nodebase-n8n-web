import { NodeExecutor } from '@/features/types';
import { httpRequestChannel } from '@/integrations/inngest/channel/http-request';
import Handlebars from 'handlebars';
import { NonRetriableError } from 'inngest';
import ky, { HTTPError, Options as KyOptions } from 'ky';

type HttpRequestData = {
  variableName: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: string;
};

Handlebars.registerHelper('json', (context) => {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  nodeId,
  context,
  data,
  step,
  publish,
}) => {
  await publish(httpRequestChannel().status({ nodeId, status: 'loading' }));

  if (!data.endpoint) {
    await publish(httpRequestChannel().status({ nodeId, status: 'error' }));
    throw new NonRetriableError('HTTP Request node: No endpoint configured');
  }
  if (!data.variableName) {
    await publish(httpRequestChannel().status({ nodeId, status: 'error' }));
    throw new NonRetriableError(
      'HTTP Request node: Variable name not configured'
    );
  }
  if (!data.method) {
    await publish(httpRequestChannel().status({ nodeId, status: 'error' }));
    throw new NonRetriableError('HTTP Request node: Method not configured');
  }

  try {
    const result = await step.run('http-request', async () => {
      const compiledEndpoint = Handlebars.compile(data.endpoint);
      const endpoint = compiledEndpoint(context);

      const method = data.method ?? 'GET';

      const headers = new Headers();
      const options: KyOptions = { method, headers };

      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        if (data.body) {
          headers.set('Content-Type', 'application/json');

          const compiledBody = Handlebars.compile(data.body);
          const resolvedBody = compiledBody(context);

          try {
            JSON.parse(resolvedBody);
            options.body = resolvedBody;
          } catch {
            throw new NonRetriableError(
              'HTTP Request node: Body is not valid JSON after template resolution'
            );
          }
        }
      }

      let response;

      try {
        response = await ky(endpoint, options);
      } catch (error) {
        if (error instanceof HTTPError) {
          const errorData = await error.response.text().catch(() => null);

          return {
            ...context,
            [data.variableName]: {
              httpResponse: {
                ok: false,
                status: error.response.status,
                statusText: error.response.statusText,
                data: (() => {
                  try {
                    return JSON.parse(errorData ?? '');
                  } catch {
                    return errorData;
                  }
                })(),
              },
            },
          };
        }

        throw error;
      }

      const contentType = response.headers.get('Content-Type') || '';
      let responseData: unknown;

      if (contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      return {
        ...context,
        [data.variableName]: {
          httpResponse: {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            data: responseData,
          },
        },
      };
    });

    await publish(httpRequestChannel().status({ nodeId, status: 'success' }));
    return result;
  } catch (err) {
    await publish(httpRequestChannel().status({ nodeId, status: 'error' }));
    throw err;
  }
};
