export default async function ({$auth, redirect}) {
  if (!await $auth.isAuthenticated) {
    return redirect('/sign-in')
  }
}
