export default async function ({$auth, route, redirect}) {
  if (await $auth.isAuthenticated()) {
    return
  }
  if (route.path !== '/sign-in') {
    return redirect('/sign-in')
  }
}
