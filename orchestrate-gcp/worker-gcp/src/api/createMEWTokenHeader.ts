import jsonwebtoken from 'jsonwebtoken';

export const createMEWTokenHeader = (
  url: string,
  secret: string,
): { [key: string]: string } => ({
  'X-MEW-TOKEN': jsonwebtoken.sign(
    {
      url,
    },
    secret,
    {
      algorithm: 'HS256',
    },
  ),
});
