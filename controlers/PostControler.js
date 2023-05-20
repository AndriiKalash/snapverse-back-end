import PostModel from "../models/Post.js";

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId, //taken from checkAuth func..
    }); // when doc is ready we should save it in DB:
    const post = await doc.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can not to create post",
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);
    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can not get tags",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    let filterParams = {};
    let sortParam = {};
    if (req.query.sort === "viewsCount") {
      sortParam.viewsCount = -1;
    } else if (req.query.sort === "createdAt") {
      sortParam.createdAt = -1;
    }
    if (req.query.tag) {
      filterParams.tags = { $in: [req.query.tag] };
    } //find().populate('user').exec() for adding user to post
    const posts = await PostModel.find(filterParams)
      .sort(sortParam)
      .populate("user")
      .exec();
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can not get posts",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    // pull dinamic id:
    const postId = req.params.id;
    //get post and ubtate, because i should add number 1 to view:
    const updateDoc = await PostModel.findByIdAndUpdate(
      postId,
      { $inc: { viewsCount: 1 } },
      { new: true }
    )
      .populate("user")
      .exec();
    if (!updateDoc) {
      return res.json.status(404).json({
        message: "Post not found",
      });
    }

    res.json(updateDoc);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can not get post",
    });
  }
};

export const removeOne = async (req, res) => {
  try {
    // pulling dinamic id:
    const postId = req.params.id;

    const deleteDoc = await PostModel.findByIdAndDelete(postId);
    if (!deleteDoc) {
      return res.json.status(404).json({
        message: "Post not found",
      });
    }
    res.json({
      succes: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can not remove post",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.findByIdAndUpdate(postId, {
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });
    res.json({
      succes: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can not update post",
    });
  }
};
