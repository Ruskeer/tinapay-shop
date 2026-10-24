import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { User } from "@/app/models/user";
import {UserInfo} from "@/app/models/userInfo";


//PUT = takes data from the user's input (the form they just typed into) and writes/updates it into the database. 
// This is the "Save" button flow — user types their phone number, clicks Save, PUT sends that to the server, server updates the database.
export async function PUT(req) {
    mongoose.connect(process.env.MONGO_URL);
    const data = await req.json();
    const {_id, name, image, ...otherUserInfo} = data;

    const session = await getServerSession(authOptions);
    const email = session.user.email;

    let filter = {};
    if (_id) {
        filter = {_id};
    } else {
        filter = {email};
    }

    const user = await User.findOne(filter);
    await User.updateOne(filter, {name, image});
    await UserInfo.findOneAndUpdate({email: user.email}, otherUserInfo, {upsert: true});

    return Response.json(true);
}



//GET = reads/retrieves data out of the database and sends it back to the frontend to display. 
// This is the "load the page" flow — when the profile page opens, 
// GET fetches whatever's already saved (name, phone, address, etc.) so the form can show it instead of blank fields.



export async function GET(req) { // handles GET requests to fetch a user's full profile
    mongoose.connect(process.env.MONGO_URL); // connects to the database so we can run queries

    const url = new URL(req.url); // turns the request address into something we can read parts of
    const _id = url.searchParams.get('_id'); // grabs ?_id=... from the address, it's null if there isn't one

    let filterUser = {}; // will hold "who are we looking for", decided by the if/else below
    if (_id) {
        filterUser = {_id}; // an id was passed, so look up that specific user
    } else {
        const session = await getServerSession(authOptions); // gets the current logged-in user's session info (via NextAuth)
        const email = session?.user?.email; // pulls just the email out of that session, safely (won't crash if session is null)
        if (!email) { // if there's no email, that means nobody's logged in
            return Response.json({}); // just send back an empty object instead of crashing
        }
        filterUser = {email}; // no id passed, so look up the logged-in user instead
    }

    const user = await User.findOne(filterUser).lean(); // find this person's main account document (name, image, admin, etc.), lean() gives a plain object
    /*if (!user) { // the id or email didn't match anyone in the database
        return Response.json({}); // send back empty instead of crashing on the next line
    }*/
    const userInfo = await UserInfo.findOne({email: user.email}).lean(); // find this person's extra profile document (phone, address, etc.)

    return Response.json({...user, ...userInfo}); // merge both into one object and send it to the frontend, if userInfo is null it just adds nothing
}