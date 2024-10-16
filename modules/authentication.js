//============= authenticating usre here ==============//
const path = require("path");
const jwt = require("jsonwebtoken");
const { users } = require('./User_Module');

const authentication = async (req , res , next)=>{
    try {
        let token = req.cookies.jwt_user;
        const verifyUser = jwt.verify(token, process.env.SECRET_TOKEN_KEY)
        const user = await users.findOne({ _id : verifyUser._id})
        console.log(req.cookies.jwt_user)

        if (user.user_position === "supervisor") {
            req.token = token;
            req.user = user;


            res.clearCookie("jwt_user");
            req.user.tokens = []
            
    
            const tokens = await req.user.generateAuthToken();
    
            res.cookie("jwt_user", tokens, {
              expires: new Date(Date.now() + 60*60*24*30*12*1000),
              httpOnlysd: true,
              // secure:true
            });
            next()
        }else {
            return error 
        }

       
    } catch (error) {
        // console.log(__dirname)
        res.sendFile(path.join(
            __dirname,
            "../public/HTML/login.html"
          ));
        
    }

}



module.exports = authentication;

