import React, { FC } from 'react';
import { Provider } from 'react-redux';
import App from './App';
import configureStore from './configureStore';

const store = configureStore();


export const ReduxRoot: FC = () => (
  <Provider store={store}>
    <App />
  </Provider>
);
