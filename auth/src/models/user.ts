import mongoose from "mongoose";
import { Password } from "../services/password";

// type for creating a user
type TUser = {
    email: string,
    password: string
}

// interface for a user model
interface IUserModel extends mongoose.Model<IUserDoc>{
    build(user: TUser): IUserDoc;
}

// interface of the created user doc
interface IUserDoc extends mongoose.Document{
    id: string;
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
},
{
    toJSON: {
        transform(doc, ret) {
            const {_id, email} = ret
            
            return {id: _id, email};
        }
    }
});

userSchema.pre("save", async function() {
    if(this.isModified("password")) {
        const hashed = await Password.toHash(this.password);
        this.set("password", hashed);
    }
});

userSchema.statics.build = (user: TUser) => {
    return new User(user);
};

const User = mongoose.model<IUserDoc, IUserModel>("User", userSchema);

export { User };