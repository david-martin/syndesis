import { APISummary } from '@syndesis/models';
import * as React from 'react';
import { ApiContext } from './ApiContext';
import { callFetch } from './callFetch';

export function useApiConnectorSummary(specification: string) {
  const apiContext = React.useContext(ApiContext);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<false | Error>(false);
  const [apiSummary, setApiSummary] = React.useState<APISummary | undefined>(
    undefined
  );

  React.useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const response = await callFetch({
          body: {
            configuredProperties: {
              specification,
            },
            connectorTemplateId: 'swagger-connector-template',
          },
          headers: apiContext.headers,
          includeAccept: true,
          includeContentType: true,
          method: 'POST',
          url: `${apiContext.apiUri}/connectors/custom/info`,
        });
        const summary = await response.json();
        if (summary.errorCode) {
          throw new Error(summary.userMsg);
        }
        setApiSummary(summary as APISummary);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [specification, apiContext, setLoading, setApiSummary, setError]);

  return { apiSummary, loading, error };
}