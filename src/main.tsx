import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ToasterProvider } from './components/ui/toaster';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ToasterProvider>
      <App />
    </ToasterProvider>
  </Provider>,
);
