import mongoose from "mongoose";

//7.create modell of post
const CommentShema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    user: {
      //relationShip: if needed user i can take him from UserShema :
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Comment", CommentShema);
