//============= authenticating usre here ==============//

const jwt = require("jsonwebtoken");
const { users } = require('./User_Module');

const authentication = async (req , res , next)=>{
    try {
        let token = req.cookies.jwt_user;
        const verifyUser = jwt.verify(token, process.env.SECRET_TOKEN_KEY)
        const user = await users.findOne({ _id : verifyUser._id})



        if (user.user_position === "supervisor") {
            req.token = token;
            req.user = user;
            res.sendFile(
              path.join(
                __dirname,
                "../public/Compounder Console/compounder_console.html"
              )
            );
          }




        console.log(req.cookies.jwt_user)
        req.token = token;
        req.user = user;


        res.clearCookie("jwt_user");
        req.user.tokens = []
        

        const tokens = await req.user.generateAuthToken();

        res.cookie("jwt_user", tokens, {
          expires: new Date(Date.now() + 60*60*12*30*12*100),
          httpOnlysd: true,
          // secure:true
        });
        next()
    } catch (error) {
      res.sendFile(path.join(
        __dirname,
        "../public/HTML/login.html"
      ));
        console.log(error )
    }

}



module.exports = authentication;

