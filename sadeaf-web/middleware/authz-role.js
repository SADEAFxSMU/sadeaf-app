const PATH_ROLES = [
  {prefix: '/account', roles: ['admin', 'volunteer', 'client', 'svcreq']},
  {prefix: '/admin', roles: ['admin']},
  {prefix: '/client', roles: ['admin', 'client']},
  {prefix: '/invoice', roles: ['admin']},
  {prefix: '/org', roles: ['admin', 'svcreq']},
  {prefix: '/volunteer', roles: ['admin', 'volunteer']},
  {prefix: '/pending', roles: ['pending']},
]

function getRoles(path) {
  for (const {prefix, roles} of PATH_ROLES) {
    if (path.startsWith(prefix)) {
      return roles
    }
  }
  return null
}

export default async function ({$auth, store, route: {path}, redirect}) {
  const roles = getRoles(path)

  if (roles === null) {
    return
  }

  if (!await $auth.isAuthenticated()) {
    return redirect('/sign-in')
  }

  if (!roles.includes(store.state.auth.user.userType)) {
    return redirect('/')
  }
}
