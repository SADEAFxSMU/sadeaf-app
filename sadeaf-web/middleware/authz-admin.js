export default async function ({$auth, redirect}) {
  if (!await $auth.isAuthed) {
    return redirect('/sign-in')
  }

  if (!await $auth.hasGroup('admin')) {
    return redirect('/client')
  }
}
