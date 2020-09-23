export default async function ({$auth, redirect}) {
  if (await $auth.isAuthenticated()) {
    return
  }

  return redirect('/sign-in')
}
