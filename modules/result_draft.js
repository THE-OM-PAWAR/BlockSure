 //                        MODULE                           //
//=========== defining schema for adding user =============//

const mongoose = require("mongoose");

//============= connecting MongoDB ============//
var prototype3_database = mongoose.createConnection(
  "mongodb://0.0.0.0/rk_coaching_DB",
  { useNewUrlParser: true }
);
  const result_schema =  new mongoose.Schema({
  student_name: String,
  your_photo: {
    type: String,
  },
  class_: {
    type: String,
  },
  session : {
    type: String
  },
  Total_mark : {
    type: Number
  },
  result_photo : String ,
  date: Date,
  result_id:String,
  user_id : String
})



var save_result = prototype3_database.model("draft_result", result_schema);

//======= Exportin Collection Here =======//
module.exports = { save_result };
