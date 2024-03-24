import { signOut } from 'auth'
import Link from 'next/link'

export function SignIn(
  props: Omit<React.ComponentPropsWithRef<typeof Link>, 'href'>
) {
  return (
    <Link {...props} href='/login'>
      Sign In
    </Link>
  )
}

export function SignOut() {
  return (
    <form
      action={async () => {
        'use server'
        await signOut()
      }}
      className='w-full'
    >
      <button type='submit' className='w-full p-0'>
        Sign Out
      </button>
    </form>
  )
}
