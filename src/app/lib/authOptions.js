//THIS PAGE IS NECESSARY FOR OBTAINING EMAIL AND PASS INFO
import { getServerSession } from "next-auth" // reads who is logged in on the server
import CredentialsProvider from "next-auth/providers/credentials" // lets us do email+password login instead of only Google/Github style logins
import mongoose from "mongoose";
import {User} from '@/app/models/user'; // our user model, same one used in register
import bcrypt from 'bcryptjs';
import GoogleProvider from "next-auth/providers/google"; //for google console cloud database
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "@/app/lib/mongoConnect";
import { UserInfo } from "@/app/models/userInfo";


export const authOptions = { // this whole object is the config for how login should work
    secret: process.env.SECRET, // used to encrypt session tokens, keeps them from being tampered with
    pages: {
        signIn: '/login',
    },
    adapter: MongoDBAdapter(client),
    session: {
      strategy: 'jwt',
    },
    providers: [
    GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET //google login
  }),
    CredentialsProvider({ // telling NextAuth "here's a custom login method, not a 3rd party one"
        name: 'Credentials',
        id: 'credentials',
        credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
    },
    async authorize(credentials, req) { // this runs every time someone tries to log in, this is where we check if they're legit
      const email = credentials?.email; // grabbing whatever email they typed
      const password= credentials?.password; // grabbing whatever password they typed

      await mongoose.connect(process.env.MONGO_URL); // connect to the db so we can actually look someone up
      const user = await User.findOne({email}) // search the users collection for a matching email
      const passwordOk = user && bcrypt.compareSync(password, user.password); // if user exists, compare typed password against the hashed one stored
      if(passwordOk) { // only if both user exists AND password matches
        return user;
      }

      return null
    }
  })
    ]
};

  export async function isAdmin() { // checks if the logged-in user is an admin (true or false)
    const session = await getServerSession(authOptions); // reads the login cookie to see who is logged in
    const userEmail = session?.user?.email; // grabs that user's email (undefined if nobody is logged in)
    if(!userEmail) { // nobody logged in?
      return false; // then they're definitely not an admin
    }
    await mongoose.connect(process.env.MONGO_URL); // connect to the database first
    const userInfo = await UserInfo.findOne({email:userEmail}); // find this user's extra info (like admin) by email
    return userInfo?.admin || false; // send back their admin value, or false if not found
  }
