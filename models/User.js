import mongoose from "mongoose";

//7.create modell of data user
const UserShema = new mongoose.Schema({
    fullName: {
        type:String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: String,
},{
    timestamps: true,
});

export default mongoose.model('User', UserShema)