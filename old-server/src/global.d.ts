declare module "@okta/oidc-middleware";

declare namespace Express {
  export interface Request {
    userContext?: any
  }
}