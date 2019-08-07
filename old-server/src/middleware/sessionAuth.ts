import { ExpressOIDC } from '@okta/oidc-middleware';
import expressSession = require('express-session');

export const sessionAuth = (app: any) => {
    // Create the OIDC client
  const oidc = new ExpressOIDC({
    client_id: process.env.OKTA_CLIENT_ID,
    client_secret: process.env.OKTA_CLIENT_SECRET,
    issuer: `${ process.env.OKTA_ORG_URL }/oauth2/default`,
    redirect_uri: `${ process.env.HOST_URL }/authorization-code/callback`,
    scope: 'openid profile',
  });

  // Configure Express to use authentication sessions
  app.use(expressSession({
    resave: true,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET as string,
  }));

  // Configure Express to use the OIDC client router
  app.use(oidc.router);

  // add the OIDC client to the app.locals
  app.locals.oidc = oidc;
};
