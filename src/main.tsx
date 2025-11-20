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
      retry: (failureCount, error: any) => {
        if (
          error?.code === 'ERR_NETWORK' ||
          error?.code === 'ERR_CONNECTION_REFUSED' ||
          error?.code === 'ERR_CONNECTION_TIMED_OUT' ||
          error?.code === 'ECONNABORTED' ||
          error?.message?.includes('timeout') ||
          error?.message?.includes('network')
        ) {
          return false;
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
