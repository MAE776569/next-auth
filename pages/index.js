import { unstable_getServerSession } from "next-auth"
import { useSession, signOut } from "next-auth/react"
import { authOptions } from "./api/auth/[...nextauth]"

export default function Home() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div>
        <h1>Welcome {session?.user?.name}</h1>
        <p>email: {session.user.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }

  return <p>Access Denied</p>
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}
