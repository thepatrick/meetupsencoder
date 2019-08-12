import React from 'react';
import ReactDOM from 'react-dom';
import { ReduxRoot } from './ReduxRoot';
import { Auth0Provider } from './react-auth0-spa';
import config from "./auth_config.json";
import { history } from "./configureStore";

const onRedirectCallback = (appState: any) => {
  history.replace(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    redirect_uri={window.location.origin}
    audience={config.audience}
    onRedirectCallback={onRedirectCallback}
  >
    <ReduxRoot />
  </Auth0Provider>,
  document.getElementById('root')
);

// import * as serviceWorker from './serviceWorker';
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
