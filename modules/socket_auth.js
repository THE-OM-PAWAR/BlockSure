const jwt = require("jsonwebtoken");
// const { users } = require('../User_Module');
const cookie = require("cookie");
const { users } = require("./User_Module");
// const { Compounder } = require("./schemas/compounder_sch");
const path = require("path");

const socket_auth = async (socket, next) => {
  try {
    const token_obj = cookie.parse(socket.handshake.headers.cookie);
    const token = token_obj.jwt_user;
    const verifyUser = jwt.verify(token, process.env.SECRET_TOKEN_KEY);

    let user = await users.findOne({ _id: verifyUser._id });
    // if (user == null) {
    //   user = await Doctor.findOne({ _id: verifyUser._id });
    // }
    const verifyUser2 = jwt.verify(
      user.tokens[0].token,
      process.env.SECRET_TOKEN_KEY
    );

    if (user.user_position === "supervisor") {
        socket.token = token;
        socket.managers = user;
      
        } 
      next();

  } catch (error) {
    // console.log(error);
    next();
  }
};

module.exports = socket_auth;
