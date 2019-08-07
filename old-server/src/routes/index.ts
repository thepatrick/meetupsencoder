import { Application } from 'express';
import { asyncResponse, AsyncResponseError } from '../middleware/asyncResponse';

import { DatabasePoolType, sql } from 'slonik';
import { withDatabaseConnection } from '../middleware/withDatabaseConnection';
import { UNPROCESSABLE_ENTITY } from 'http-status-codes';
import { isNonEmptyString } from '../helpers/isNonEmptyString';

export const registerRoutes = (app: Application, pool: DatabasePoolType) => {
  const oidc = app.locals.oidc;

  app.get('/api/v1/whoami', oidc.ensureAuthenticated(), asyncResponse((req, res) => {
    const user = req.userContext ? req.userContext.userinfo : null;
    return user;
  }));

  app.get('/api/v1/group', asyncResponse(withDatabaseConnection(pool, async (req, res, connection) => {
    const groups = await connection.any(
      sql`SELECT id, group_id, brand FROM groups ORDER BY brand`,
    );

    return groups;
  })));

  app.post('/api/v1/group', asyncResponse(withDatabaseConnection(pool, async (req, res, connection) => {
    if (!isNonEmptyString(req.body.groupId) ||
      !isNonEmptyString(req.body.brand)) {
      throw new AsyncResponseError('Missing group ID or brand', UNPROCESSABLE_ENTITY);
    }
    const id = await connection.oneFirst(
      sql`
        INSERT INTO groups (group_id, brand)
        VALUES ( ${req.body.groupId}, ${req.body.brand} )
        RETURNING id;
      `,
    );

    return { id };
  })));

  app.get('/api/v1/group/:group', asyncResponse(async (req, res) => {
    return {};
  }));

  // define a secure route handler for the login page that redirects to /guitars
  app.get('/login', oidc.ensureAuthenticated(), (req, res) => {
    res.redirect('/');
  });

  // define a route to handle logout
  app.get('/logout', (req: any, res) => {
    req.logout();
    res.redirect('/');
  });

  // define a route handler for the default home page
  app.get('/', (req, res) => {
    res.send('Hello world. (Maybe try /api/v1/group?)');
  });

};
