 //                        MODULE                           //
//=========== defining schema for adding user =============//

const bcrypt = require("bcryptjs/dist/bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { Students } = require("./Schemas/student_schema");

//============= connecting MongoDB ============//
var prototype3_database = mongoose.createConnection(
  "mongodb://0.0.0.0/rk_coaching_DB",
  { useNewUrlParser: true,
    // useCreateIndex: true, 
    autoIndex: true,  }
);
  const users_schema =  new mongoose.Schema({
  user_name: String,
  user_mobile: {
    type: Number,
    required: true,
    unique: true,
  },
  user_passward: {
    type: String,
    required: true,
  },
  tokens : [{
    token: {
      type: String,
      required: true,
    },
  }],
  result: [
    {
      student : String,
      your_photo : String,
      class_ : String,
      session : String,
      Total_mark :Number,
      result_photo :String,
      status : String,
      date : Date
    }
  ] ,

  rejected_request : [{
    class_ : String,
    session : String
  }],

  updates : [{
    type_update : String,
    done_by_id : String ,
    done_by_name :String,
    student_name : String , 
    student_id : String , 
    instalment_id : String , 
    fees_amount : Number , 
    profile_img : String,
    message : String,
    recipt_No : Number,
    time : Date
  }],

  profile_img : String ,
  user_position :String,
  sign_up_date : Date,
  login_status : Boolean,
  Amount_presets : [String]
})

 //                MIDDLEWARE                   //
//============ generating token ===============//
users_schema.methods.generateAuthToken = async function (){
  try {
      const token = jwt.sign({ _id: this._id }, process.env.SECRET_TOKEN_KEY)
      this.tokens = this.tokens.concat({token : token})
      await this.save();
      console.log("token saved 40")
    return token
  } catch (error) {
    res.send("the error is  =>    " + error) 
    console.log("the error is  =>    " + error) 
  }
}

 //                    MIDDLEWARE                         //
//============ converting passward into hash =============//
users_schema.pre('save' , async function(next){
  if (this.isModified("user_passward")) {
     this.user_passward = await bcrypt.hash(this.user_passward , 10)
    next()
  }
} )


var users = prototype3_database.model("users_information", users_schema);

//======= Exportin Collection Here =======//
module.exports = { users };
