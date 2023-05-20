//1. "npm init"
//.then => tap yes
//                    in terminal: npm run start:dev
// install "nodemon" for updating server automaticaly if change something, add this:to packhage.json scripts : "start:dev": "nodemon index.js"

//2. libarary , help us to create webServer:"npm install express"
//for using import in node.js , i need in package.json add - "type":"module",
import express from "express";
// cors middleware and use it in your app:
//This should allow requests from any origin to access your server's resources.
import cors from "cors";

// libaraty for add file:
import multer from "multer";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
  commentCreateValidation,
} from "./validations/validations.js";

//6. use data base mongoDB: npm install mongoose
import mongoose from "mongoose";

import { chechAuth, handleValidationErrors } from "./utils/index.js";
import {
  UserControler,
  PostControler,
  CommentControler,
} from "./controlers/index.js";

//3.veb-server:
const app = express();
//4.for reading req from user in json format:
app.use(express.json());

app.use(cors());

//create stor for multer pictures:
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    //this func say she is not get any error and save img to holder "uploads:"
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    //this funk create name of file, we want to pull orig name of this file:
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
//express if you recive get req for uploads, then check in this holder what i pass:
app.use("/uploads", express.static("uploads"));

// route for register user:
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserControler.register
);
//route for login user:
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserControler.login
);
// res of this funk chechAuth let me know autrize user or not, if yes,userControler.getMe find him.and we can use information about him for showing in his profile or someware else:
app.get("/auth/me", chechAuth, UserControler.getMe);

//create new rotes for posts:
app.get("/posts", PostControler.getAll);
app.get("/tags", PostControler.getLastTags);
app.get("/posts/:id", PostControler.getOne);
app.post(
  "/posts",
  chechAuth,
  postCreateValidation,
  handleValidationErrors,
  PostControler.create
);
app.delete("/posts/:id", chechAuth, PostControler.removeOne);
app.patch(
  "/posts/:id",
  chechAuth,
  postCreateValidation,
  handleValidationErrors,
  PostControler.update
);

//route for img:
app.post("/uploads", upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

//routes for comments  :
app.post(
  "/comments",
  chechAuth,
  commentCreateValidation,
  handleValidationErrors,
  CommentControler.create
);
app.get("/comments", CommentControler.getAll);
app.delete("/comments/:id", chechAuth, CommentControler.removeOne);

//chacking server work in console:
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server: ok");
});

//connect to DB:
mongoose
  .connect(
    "mongodb+srv://andreykalash:wwwwww@cluster0.48nwuth.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));
