//                        MODULE                           //
//=========== defining schema for adding user =============//

const bcrypt = require("bcryptjs/dist/bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//============= connecting MongoDB ============//
var rk_coaching_DB = mongoose.createConnection(
  "mongodb://0.0.0.0/rk_coaching_DB",
  {
    useNewUrlParser: true,
    // useCreateIndex: true,
    autoIndex: true,
  }
);
const Student_sch = new mongoose.Schema({
  Student_name: {
    type: String,
    required: true,
  },
  Father_name: {
    type: String,
    required: true,
  },
  Contact_No : {
    type: Number,
    required: true,
  },
  School_name :{
    type: String,
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },
  Addmission_fee : {
    type: String,
    required: true,
  },

  Batch : {},

  Main_installment: [{
    Amount : Number, 
    added_by_ID : String,
    added_by_Name : String , 
    payment_time : Date,
    remove_instalment : Boolean , 
    remove_reason : String,
    recipt_No : Number
  }],

  profile_img : {
    type: String,
  },
  token: {
    type: String,
    required: true,
  },

  next_expected_date : {
    date : Date,
    Amount : Number
  },
  Course_fees: Number,
  Creation_date: Date,
  fees_completed : Boolean,
  serial_number : Number
});

//                MIDDLEWARE                   //
//============ generating token ===============//
Student_sch.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id }, process.env.SECRET_TOKEN_KEY2);
    this.token = token;
    await this.save();
    console.log("token saved 40");
    return token;
  } catch (error) {
    // res.send("the error is  =>    " + error);
    console.log("token_gen error  =>    " + error);
  }
};

// //                    MIDDLEWARE                         //
// //============ converting passward into hash =============//
// users_schema.pre("save", async function (next) {
//   if (this.isModified("user_passward")) {
//     this.user_passward = await bcrypt.hash(this.user_passward, 10);
//     next();
//   }
// });

var Students = rk_coaching_DB.model("Students", Student_sch);

//======= Exportin Collection Here =======//
module.exports = { Students };
