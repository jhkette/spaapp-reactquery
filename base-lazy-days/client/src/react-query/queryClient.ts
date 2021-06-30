import { QueryClient } from 'react-query';
import { createStandaloneToast } from '@chakra-ui/react';
import { theme } from '../theme';

const toast = createStandaloneToast({ theme });
// you could also use error boundary https://reactjs.org/docs/error-boundaries.html
// this function is an error handler that is passed to the reactqueryclient
export function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const id = 'react-query-error';
  const title =
    error instanceof Error
      ? // remove the initial 'Error: ' that accompanies many errors
        error.toString().replace(/^Error:\s*/, '')
      : 'error connecting to server';

  // prevent duplicate toasts
  toast.closeAll();
  toast({ id, title, status: 'error', variant: 'subtle', isClosable: true });
}
// add errorhandler to default options
export const queryClient = new QueryClient(
    {
        defaultOptions:{
            queries: {
                onError: queryErrorHandler,
                staleTime: 600000,
                cacheTime: 900000,
                refetchOnMount: false,
                refetchOnReconnect: false,
                refetchOnWindowFocus: false

            },
            mutations: {
              onError: queryErrorHandler
            }

        }
    }
);
