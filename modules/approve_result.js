
const jwt = require("jsonwebtoken");
const { users } = require('./User_Module');
const { save_result } = require("./result_draft");
const { approved_result } = require("./approved_result");
var fs = require('fs');
const cookie = require("cookie");



let approving_func = async ( _id )=>{
    try {
        let date = Date(Date.now());
        const result = await save_result.find({_id})
        const real_result = result[0]
        
        // let student = await users.findOne({_id : result[0].user_id})
        // student.result.forEach(element => {
            // if (element._id == result[0].result_id) {
                // element.status = "uneditable"
            // }
        // });
        // student.save()


        // console.log( `public/uploads/result_folder/${real_result.result_photo}`)
        fs.stat(`public/uploads/result_folder/${real_result.result_photo}`, function (err, stats) {
        //   console.log(stats);//here we got all information of file in stats variable
        
          if (err) {
              return console.error(err);
          }
          
          console.log(real_result.result_photo)
          if (real_result.result_photo == "user.svg") {
            
          } else {
            fs.unlink(`public/uploads/result_folder/${real_result.result_photo}`,function(err){
                 if(err) return console.log(err);
                 console.log('file deleted successfully');
            });  
            
          }
        });


        const obj = {
            student_name: real_result.student_name,
            your_photo: real_result.your_photo,
            class_: real_result.class_,
            session : real_result.session,
            Total_mark : real_result.Total_mark,
            date: date,
            result_id: real_result.result_id,
            user_id : real_result.user_id,
            rank:""
        }
        const approved = new approved_result(obj)
        let all_done 
        await approved.save().then(()=>{
             all_done = true
        })
        console.log(all_done)
        if (all_done) {
            try {
              const result = await save_result.deleteOne({ _id });
              console.log(result)
              return true
            } catch (error) {
              console.log(error + " in saveing result of user");
              return false
            }
            
        }




    } catch (error) {
        console.log(error)
    }
}



module.exports = approving_func;