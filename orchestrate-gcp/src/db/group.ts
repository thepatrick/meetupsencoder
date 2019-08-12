import { isNonEmptyString } from '../utils/isNonEmptyString';
import { where, isNil } from 'ramda';
import { DatabasePoolConnectionType, sql } from 'slonik';
import generate from 'nanoid/generate';
import { connect } from 'http2';

export interface GroupSubmission {
  brand: string;
}

export const isValidGroupSubmission = (
  possible: unknown,
): possible is GroupSubmission => {
  if (isNil(possible) || typeof possible !== 'object') {
    throw new Error('Group is not an object');
  }

  return where(
    {
      brand: isNonEmptyString,
    },
    possible,
  );
};

export const insertGroupWithSubmission = async (
  connection: DatabasePoolConnectionType,
  groupSubmission: GroupSubmission,
): Promise<string> => {
  const id = generate('0123456789abcdefghijklmnopqrstuvwxyz', 16);

  await connection.query(sql`
  INSERT INTO "group" (
    "groupId",
    "brand",
    "createdAt",
    "updatedAt"
  ) VALUES (
    ${id},
    ${groupSubmission.brand},
    now(),
    now()
  )
`);

  return id;
};

export const addUserToGroup = async (
  connection: DatabasePoolConnectionType,
  groupId: string,
  userSub: string,
): Promise<void> => {
  await connection.query(sql`
    INSERT INTO "group_user" (
      "groupId",
      "userSub"
    ) VALUES (
      ${groupId},
      ${userSub}
    )
  `);
};
