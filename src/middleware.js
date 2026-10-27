import { withAuth } from "next-auth/middleware";

export default withAuth({
    secret: process.env.SECRET,
    pages: {
        signIn: '/login',

    },
})


export const config = {
    matcher: [
        '/profile',
        '/orders/:path*',
        '/categories',
        '/menu-items/:path*',
        '/users/:path*',
    ],
}