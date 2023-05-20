// generat token: npm install jsonwebtoken
import jwt from "jsonwebtoken";

//10.secure for password...
import bcrypt from "bcrypt";

//9.import schema DB...
import UserModel from "../models/User.js";


export const register = async(req,res) => {

    try {
    //10.secure for password in backEnd: npm install bcrypt 
        const password = req.body.password;
    //generating encriptin algoritm:
        const salt  = await bcrypt.genSalt(10);
    // secure for backEnd: here is wiil be secure password:
        const hash = await bcrypt.hash(password, salt);

    //9.create our user wih mongoDB :
        const doc = new UserModel({
         email: req.body.email,
         fullName: req.body.fullName,
         avatarUrl: req.body.avatarUrl,
         passwordHash: hash,
        })
    // ready save in DB:  
        const user = await doc.save();
        
    //from user._id(created automaticaly by DB)  we create token.
    // this token let us know everything about user : 
        const token = jwt.sign(
            {
              _id: user._id,
            },
        //key which help to encrypt our token:
             "secret123",
        //live time our token 30 days:
           {  
              expiresIn: '30d'
            }
        );  
        
    //during registration we do not need to return hash(password):
    const {passwordHash, ...userData} = user._doc;    

        res.json({
            ...userData,
            token,
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Can not to registrate',
        });
    }
};

export const login = async(req, res) => {
    try {
        //we need to fined user: i say UserModel take from req what user input and chack inside you: 
        const user = await UserModel.findOne({email: req.body.email});
        if (!user) {
            return res.status(404).json({
                massage: 'not found this user',
            });
        }
    //check password  
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPass) {
            return res.status(400).json({
                massage: 'login or password is not correct',
            });
        }
    //when we fined this user, we create token agin : 
        const token = jwt.sign(
            {
              _id: user._id,
            },
    //key which help to encrypt our token:
             "secret123",
    //live time our token 30 days:
            { 
              expiresIn: '30d'
            }
        );  
        const {passwordHash, ...userData} = user._doc;
        res.json({
            ...userData,
            token,
        });
            
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Can not to aotorizat',
        });
    }
};

export const getMe = async(req, res) => {
    try {//now we have id created by checkAuth func(decoded token gave us), to find user by id in our DB:
        const user = await UserModel.findById(req.userId) ;
        if (!user) {
            return res.status(404).json({
                message:'user not found'
            });
        }   
        const {passwordHash, ...userData} = user._doc;
        res.json({
            ...userData,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'No access',
        });
    }
}