import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from './components/GlobalStyles';
import store from '~/redux';
import { Provider } from 'react-redux';
import { GlobalProvider } from './composables/GlobalProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   // <React.StrictMode>
   <GlobalProvider>
      <Provider store={store}>
         <GlobalStyles>
            <App />
         </GlobalStyles>
      </Provider>
   </GlobalProvider>,
   // </React.StrictMode>,
);
reportWebVitals();
