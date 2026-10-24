import mongoose from "mongoose"; // grabbing the mongoose library so we can talk to MongoDB
import {User} from "@/app/models/user"; // grabbing our User model/rules we defined earlier

//THIS PAGE IS NECESSARY FOR OBTAINING EMAIL AND PASS INFO
export async function POST(req) {
    // this function runs whenever a POST request hits /api/register




    const body = await req.json()
     // req = the incoming request. .json() reads whatever data was sent (email/password) and turns it into a normal JS object
     // await = wait for this reading to finish before moving to the next line
    mongoose.connect(process.env.MONGO_URL);
    // opens a connection to actual MongoDB database, using the secret URL stored in .env.local

    const pass = body.password;
    if(!pass?.length || pass.length < 5) {
        new Error('password must be atleast 5 characters')
    }

    UserSchema.post('validate', function(user) {
        const notHashedPassword = pass;
        const salt = bcrypt.genSaltSync(10); //formula to hashed the incoming passwords
        body.password = bcrypt.hashSync(notHashedPassword, salt); //now mix that formula to the incoming password
    });
    const createdUser = await User.create(body);
    // takes the body (email + password) and saves it as a new document in "users" collection
    // User.create() checks it against your Schema rules first (required fields, unique email, etc.)
    // await = wait for MongoDB to actually finish saving before continuing

    return Response.json(createdUser);
    // sends a response back to your frontend form, containing the newly created user (confirmation it worked)
}