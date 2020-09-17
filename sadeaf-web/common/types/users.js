import { ROLES } from "./constants";

const { admin, client, volunteer, service_requestor } = ROLES;

const ROLE_PROFILE_PAGE_PATH_MAPPING = {
  [admin]: '/admin',
  [client]: '/client',
  [volunteer]: '/volunteer',
  [service_requestor]: '/org',
}

export function getUserProfilePagePath({ role, id }) {
  role = role.toLowerCase();
  return ROLE_PROFILE_PAGE_PATH_MAPPING[role] + '/' + id;
}
