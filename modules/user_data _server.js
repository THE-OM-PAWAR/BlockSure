//============= checking & serving user specific stuff ==============//

const jwt = require("jsonwebtoken");
const { users } = require('./User_Module');

const data_serving = async (req , res , next)=>{
    try {
        const token = req.cookies.jwt_user;
        console.log(token == undefined)
        // if (token == undefined) {
        //     return
        // }
        const verifyUser = jwt.verify(token, process.env.SECRET_TOKEN_KEY)
        const user = await users.findOne({ _id : verifyUser._id})
        // console.log(user + 11)
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

        if (user.rejected_request) {
            
        }
        next()
        
    } catch (error) {
        
        console.log("18 line user_data_server")
        res.status(201).json({
        position: "modal5",
        method: "get",
        headers: {
          "content-type": "application/json",
        },
        body:{
        modal_html : `
            <div class="modal_wrapper">
                <div class="modal_container">
                    <button class="close">&times;</button>
                    <h2 class="modal_h2" >Already RK Coaching Student</h2>
                    <p class="text">If you already Rk coaching student then create your account click on Sign Up</p>
                    <div class="action">
                    <a href="/signIn" ><button class="btn_purple">Sign Up</button></a>
                        <a href="/HTML/login.html" ><button class="btn_purple">Login</button></a>
                    </div>
                </div>
            </div>`
        }})
    }

}

module.exports = data_serving;