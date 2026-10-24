import {Category} from "@/app/models/Category";
import mongoose from "mongoose";
import {searchParams} from "next/navigation";
import { isAdmin } from "@/app/lib/authOptions";

export async function POST(req) {
    mongoose.connect(process.env.MONGO_URL);
    const {name} = await req.json();
    if (await isAdmin()) {
        const categoryDoc = await Category.create({name});
        return Response.json(categoryDoc);
    } else {
        return Response.json({});
    }
}

export async function PUT(req) { // handles PUT requests - runs when editing an existing category
    await mongoose.connect(process.env.MONGO_URL);
    const {_id, name} = await req.json(); // unpacks the incoming data - pulls out both the category's ID and its new name
    if(await isAdmin()) {  
        await Category.updateOne({_id}, {name}); // find the category matching that exact ID, then update its name field
    }
    return Response.json(true); // tells the frontend the update succeeded
}

export async function GET() {
    await mongoose.connect(process.env.MONGO_URL);
    return Response.json(
        await Category.find()
    );
}

export async function DELETE(req) { // handles DELETE requests - runs when deleting an existing category
    await mongoose.connect(process.env.MONGO_URL);
    const url = new URL(req.url); // creates a URL object from the incoming request's URL
    const _id = url.searchParams.get("_id"); // pulls out the value of the _id query parameter from the URL

    if(await isAdmin()) {
        await Category.deleteOne({_id}); // find the category matching that exact ID, then delete it
    }
    return Response.json(true); // tells the frontend the deletion succeeded
}