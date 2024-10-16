//============= authenticating usre here ==============//

const jwt = require("jsonwebtoken");
const { users } = require('./User_Module');

const authentication_logout = async (req , res , next)=>{
    try {
        let token = req.cookies.jwt_user;
        const verifyUser = jwt.verify(token, process.env.SECRET_TOKEN_KEY)
        const user = await users.findOne({ _id : verifyUser._id})
        console.log(req.cookies.jwt_user)

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

       
    } catch (error) {
        res.status(201).send('login first')
    }

}



module.exports = authentication_logout;

