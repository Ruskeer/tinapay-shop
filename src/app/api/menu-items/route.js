import {MenuItem} from "@/app/models/MenuItems";
import mongoose from "mongoose";
import { isAdmin } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) { // handles new menu item orders coming in
    mongoose.connect(process.env.MONGO_URL); // connect to the restaurant/database
    const data = await req.json(); // unpack the incoming order details

    if(await isAdmin()) {
        const menuItemDoc = await MenuItem.create(data); // cook the dish and add it to the menu
        return Response.json(menuItemDoc); // hand the finished dish back to the customer
    } else {
        return Response.json({error: 'Not an admin'}, {status: 403});
    }
    
}

export async function PUT(req) { // handles updating menu items
    mongoose.connect(process.env.MONGO_URL); // connect to the restaurant/database
    if(await isAdmin()) {
        const {_id, ...data} = await req.json(); // pull out the item's id separately, keep the rest (name, description, basePrice, image) together as data
        await MenuItem.findByIdAndUpdate(_id, data); // find the menu item with that id, update it with the new data
    }
    return Response.json(true); // tell the frontend the update worked
}


export async function GET(req) { // handles requests to see the full menu
    mongoose.connect(process.env.MONGO_URL); // connect to the restaurant/database
    return Response.json( // package this up and hand it back to whoever asked
    await MenuItem.find() // go fetch the whole menu from the kitchen first 
    );
}

export async function DELETE(req) { // handles requests to delete a menu item
    mongoose.connect(process.env.MONGO_URL);
    const url = new URL(req.url); // creates a URL object from the incoming request's URL
    const _id = url.searchParams.get("_id"); // pulls out the value of the _id query parameter from the URL
    if (await isAdmin()) {
        await MenuItem.deleteOne({_id}); // find the category matching that exact ID, then delete it
    }
    return Response.json(true); // tells the frontend the deletion succeeded
}