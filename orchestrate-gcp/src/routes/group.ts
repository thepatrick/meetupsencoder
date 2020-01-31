import { Application } from 'express';
import { RequestHandler } from 'express-jwt';
import { Logger } from 'pino';
import { DatabasePoolType, sql } from 'slonik';
import { ForbiddenError } from '../httpErrors/ForbiddenError';
import { asyncResponse } from '../middleware/asyncResponse';
import { withDatabaseConnection } from '../middleware/withDatabaseConnection';
import { jwtUserFromRequestUser } from './JWTUser';
import { UnprocessableEntityError } from '../httpErrors/UnprocessableEntityError';
import { isValidGroupSubmission, insertGroupWithSubmission, addUserToGroup } from '../db/group';

export const registerGroupRoutes = (
  logger: Logger,
  app: Application,
  pool: DatabasePoolType,
  checkJwt: RequestHandler,
) => {
  app.get('/api/v1/group', checkJwt, asyncResponse(
    withDatabaseConnection(
      pool, async (req, res, connection) => {
        const user = jwtUserFromRequestUser(req.user);
        console.log('req.user', user);
        const groups = await connection.any(
          sql`
            SELECT
              "groupId",
              "brand",
              "createdAt",
              "updatedAt"
            FROM "group"
            WHERE "groupId" IN (
              SELECT "groupId"
              FROM "group_user"
              WHERE "userSub" = ${user.sub}
            )
            ORDER BY "brand" ASC
          `,
        );

        return groups;
      },
    ),
  ));

  app.post('/api/v1/group', checkJwt, asyncResponse(
    withDatabaseConnection(
      pool, async (req, res, connection) => {
        logger.info('Create new group');
        const user = jwtUserFromRequestUser(req.user);
        console.log('req.user', user);

        if (!user.permissions.includes('group:add')) {
          throw new ForbiddenError();
        }

        // parse body
        const groupSubmission = req.body;

        logger.info('groupSubmission', { groupSubmission });

        if (!isValidGroupSubmission(groupSubmission)) {
          // TODO: Actuall call out that it's a validation proble.
          throw new UnprocessableEntityError();
        }

        logger.info(`Creating group with brand: ${groupSubmission.brand}`);

        const groupId = await insertGroupWithSubmission(
          connection,
          groupSubmission,
        );

        await addUserToGroup(
          connection,
          groupId,
          user.sub,
        );

        return { groupId, ...groupSubmission };
      },
    ),
  ));

  app.get('/api/v1/group/:groupId/events', checkJwt, asyncResponse(
    withDatabaseConnection(
      pool, async (req, res, connection) => {
        logger.info('Getting group', req.params.groupId);

        return {};
      },
    ),
  ));
};
