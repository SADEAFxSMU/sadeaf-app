const PATH_ROLES = [
  { prefix: '/account', roles: ['admin', 'volunteer', 'client', 'service_requestor'] },
  { prefix: '/admin', roles: ['admin'] },
  { prefix: '/client', roles: ['admin', 'client'] },
  { prefix: '/invoice', roles: ['admin'] },
  { prefix: '/org', roles: ['admin', 'service_requestor'] },
  { prefix: '/volunteer', roles: ['admin', 'volunteer'] },
  { prefix: '/pending', roles: ['pending', 'volunteer', 'client', 'service_requestor', 'admin'] },
  { prefix: '/registration', roles: ['pending'] },
];

function getRoles(path) {
  // Landing pages which we do not want admins to be able to visit
  // Eg. Admins can visit /client/_id to view a client's profile page, but not /client
  // Not technically necessary, just a good QOL thing to have
  const landingPages = ['/client', '/volunteer', '/org'];

  for (const { prefix, roles } of PATH_ROLES) {
    if (path.startsWith(prefix)) {
      if (landingPages.includes(path)) {
        return roles.filter((role) => role !== 'admin');
      }
      return roles;
    }
  }
  return null;
}

export default async function ({ $auth, store, route: { path }, redirect }) {
  const roles = getRoles(path);
  const user = store.state.auth.user;

  if (roles === null) {
    return;
  }

  if (!(await $auth.isAuthenticated())) {
    return redirect('/sign-in');
  }

  if (!roles.includes(user.userType)) {
    return redirect('/');
  }
}
