import { useSession } from "next-auth/react"

const Layout = ({ children }) => {
  const { status } = useSession()

  if (status === "loading") {
    return <p>...loading</p>
  }

  return <>{children} </>
}

export default Layout
