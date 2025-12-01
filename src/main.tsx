import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ToasterProvider } from './components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: (failureCount, error: unknown) => {
        if (error && typeof error === 'object') {
          const err = error as { code?: string; message?: string };
          if (
            err.code === 'ERR_NETWORK' ||
            err.code === 'ERR_CONNECTION_REFUSED' ||
            err.code === 'ERR_CONNECTION_TIMED_OUT' ||
            err.code === 'ECONNABORTED' ||
            err.message?.includes('timeout') ||
            err.message?.includes('network')
          ) {
            return false;
          }
        }
        return failureCount < 1;
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ToasterProvider>
        <App />
      </ToasterProvider>
    </QueryClientProvider>
  </Provider>,
);
