import { useState } from "react"
import { signIn, getCsrfToken } from "next-auth/react"

const Login = ({ csrfToken }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const onSubmit = (e) => {
    e.preventDefault()
    signIn("credentials", { username, password, callbackUrl: "/" })
  }

  return (
    <div>
      <h1>Login using credentials</h1>
      <form onSubmit={onSubmit}>
        <div>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        </div>
        <div>
          <label htmlFor="user-name">Username</label>
          <input
            id="user-name"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <input type="submit" />
        </div>
      </form>
    </div>
  )
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context)
  return {
    props: { csrfToken },
  }
}

export default Login
