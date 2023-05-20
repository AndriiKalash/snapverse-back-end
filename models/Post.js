import mongoose from "mongoose";

//7.create modell of post
const PostShema = new mongoose.Schema({
    title: {
        type:String,
        required: true,
    },
    text: {
        type: String,
        required: true,
        unique: true,
    },
    tags: {
        type: Array,
        default: [],
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    user: {//relationShip: if needed user i can take him from UserShema :
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    imageUrl: String,
},{
    timestamps: true,
});

export default mongoose.model('Post', PostShema)