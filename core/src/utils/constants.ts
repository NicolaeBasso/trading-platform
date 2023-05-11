export const jwtSecret = process.env.JWT_SECRET;

export const clientUrl = process.env.CLIENT_URL;

export const Roles = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};

export const ROLES_KEY = 'roles';

export enum ENV_TYPE {
  LOCAL = 'LOCAL',
  DEV = 'DEV',
  TEST = 'TEST',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
}
