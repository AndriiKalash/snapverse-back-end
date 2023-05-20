//5. generat token for autorithation, which help us call savety requests to personal information:whith token we can understand author user or not: npm install jsonwebtoken
import jwt from "jsonwebtoken";

// midleware function which let us know if we alowd to get back info about user:
//this funtion use in get rout
export default (req, res, next) => {
  //we need to parse token and encrypt this token:
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  if (token) {
    // res.send(token); just check
    try {
      // decode token:
      const decoded = jwt.verify(token, "secret123");
      // add decoded _id to request: by this id i'll get this user next:
      req.userId = decoded._id;
      // all is ok you can do next step:
      next();
    } catch (error) {
      return res.status(403).json({
        message: "No access",
      });
    }
  } else {
    return res.status(403).json({
      message: "No access",
    });
  }
};
