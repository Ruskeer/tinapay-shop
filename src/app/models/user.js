import bcrypt from 'bcryptjs';
import { model,models, Schema } from "mongoose"

const UserSchema = new Schema ({
    name: {type: String},
    email: {type: String, required: true, unique: true},
    password: { type: String},
    image:{type:String},
    
    


        //,required: true,
        /*validate: pass => {
            if(!pass?.length || pass.length < 5) {
                new Error('Password must be atleast 5 characters');   
            }
        },*/
    
    
}, {timestamps: true}); //added timestamps so we could know when they created the account nor login logout exact time and date 



export const User = models?.User || model('User', UserSchema); //is "User" was already created if not then create it fresh with our UserSchema rule we created above