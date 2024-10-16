

const jwt = require("jsonwebtoken");
const { Batches } = require('../Schemas/batch_schema');


let add_batch = async (req, res)=>{
    try {
        const user_info = await Batches.find({ Batch_code: req.body.Batch_code });
        // console.log(user_info[0])
        let exist=undefined;
        if (user_info[0] !== undefined ) {
          if(user_info[0].Batch_code == req.body.Batch_code || user_info[0].Batch_name == req.body.Batch_name ){
            exist = true
          }
          console.log(3)
        }
        if (exist == true) {
          res.status(400).send("This batch Code already exist")
          return
        }
        if (exist==undefined) {
          var Batch = new Batches({
            Batch_name: req.body.Batch_name,
            Batch_code: req.body.Batch_code,
            Course_fees: req.body.Course_Fees,
            Creation_date: Date(Date.now()),
          });
    
          const token = await Batch.generateAuthToken();
    
    
          await Batch
            .save()
            .then((e) => {
              res.status(201).redirect("/management_console");
            })
            .catch((error) => {
              res.status(400).send("not saveed batch 210" + error);
            });
            
        }
    
    } catch (error) {
      res.status(400).send("not saveed batch 216" + error);
    }
}

module.exports = add_batch;


