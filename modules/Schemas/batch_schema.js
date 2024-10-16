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
const Batches_sch = new mongoose.Schema({
  Batch_name: {
    type: String,
    required: true,
  },
  Batch_code: {
    type: String,
    required: true,
    unique: true,
  },
  students : [ String ],

  token: {
    type: String,
    required: true,
  },

  Course_fees: Number,
  Creation_date: Date,
});

//                MIDDLEWARE                   //
//============ generating token ===============//
Batches_sch.methods.generateAuthToken = async function () {
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

var Batches = rk_coaching_DB.model("Batches", Batches_sch);

//======= Exportin Collection Here =======//
module.exports = { Batches };
