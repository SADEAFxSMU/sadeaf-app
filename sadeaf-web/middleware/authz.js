export default async function ({$auth, redirect}) {
  if (!await $auth.isAuthed) {
    return redirect('/sign-in')
  }
}
