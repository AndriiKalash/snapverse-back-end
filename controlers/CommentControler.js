import CommentModel from "../models/Comment.js";
import UserModel from "../models/User.js";

export const create = async (req, res) => {
  try {
    //req.userId ,taken from checkAuth func..
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    const doc = new CommentModel({
      postId: req.body.postId,
      text: req.body.text,
      user,
    }); // when doc is ready we should save it in DB:
    const comment = await doc.save();
    res.json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can not to create comment",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    //find().populate('user').exec() for adding user to post
    const comments = await CommentModel.find().populate("user").exec();
    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can not get comments",
    });
  }
};

export const removeOne = async (req, res) => {
  try {
    // pulling dinamic id:
    const commentId = req.params.id;

    const deleteDoc = await CommentModel.findByIdAndDelete(commentId);
    if (!deleteDoc) {
      return res.json.status(404).json({
        message: "Comment not found",
      });
    }
    res.json({
      succes: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can not delete comment",
    });
  }
};
