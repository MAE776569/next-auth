import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import crypto from "crypto"

const refreshAccessToken = (token) => crypto.randomBytes(12).toString("hex")

export const authOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        // const res = await fetch("/your/endpoint", {
        //   method: "POST",
        //   body: JSON.stringify(credentials),
        //   headers: { "Content-Type": "application/json" },
        // })
        // const user = await res.json()

        // If no error and we have user data, return it
        // if (res.ok && user) {
        //   return user
        // }
        return {
          id: 1,
          name: credentials.username,
          email: `${credentials.username}@gmail.com`,
          image: null,
          accessToken: crypto.randomBytes(12).toString("hex"),
          refreshToken: crypto.randomBytes(12).toString("hex"),
          accessTokenExpiry: Date.now() + 5 * 60 * 60 * 1000,
        }
        // Return null if user data could not be retrieved
        // return null
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        // This will only be executed at login. Each next invocation will skip this part.
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.accessTokenExpiry = user.accessTokenExpiry
      }

      // Check refresh token before 2 seconds of expiry.
      const shouldRefreshTime = Math.round(
        token.accessTokenExpiry - 2 * 1000 - Date.now()
      )

      // If the token is still valid, just return it.
      if (shouldRefreshTime > 0) {
        return token
      }

      // Refresh the token.
      token = refreshAccessToken(token)
      return token
    },
    session: ({ session, token }) => {
      // Here we pass accessToken to the client to be used in authentication with your API
      session.accessToken = token.accessToken
      session.accessTokenExpiry = token.accessTokenExpiry
      session.refreshToken = token.refreshToken

      return session
    },
  },
  secret: "TOP_SECRET",
}

export default NextAuth(authOptions)
