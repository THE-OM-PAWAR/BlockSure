//============= Require Module are here ============//
require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const cookie = require("cookie");
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs/dist/bcrypt");
const port = 8000;
const fs = require("fs");

const io = require("socket.io")(http, {
  cookie: true,
});

// ============declearing module=========//
const authentication = require("./modules/authentication");
const authentication_logout = require("./modules/authentication_logout");
const approving_func = require("./modules/approve_result");
const data_serving = require("./modules/user_data _server");
const add_batch = require("./modules/module_console/add_batch");
const socket_auth = require("./modules/socket_auth");
const { users } = require("./modules/User_Module");
const { save_result } = require("./modules/result_draft");
const { approved_result } = require("./modules/approved_result");
const { Batches } = require("./modules/Schemas/batch_schema");
const { Students } = require("./modules/Schemas/student_schema");
io.use(socket_auth);

//============= middleware ============//
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());

//============= Static file  ============//
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));

//============= Storage For Image ============//

//============= Storage For Image ============//
var storage_student = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/result_folder");
    console.log(file);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + Math.floor(Math.random() * 1000) + file.originalname);
    ``;
  },
});

var uploads = multer({ storage: storage_student });
var multiple_upload = uploads.fields([
  { name: "your_photo" },
  { name: "result_photo" },
]);

var student_photo = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/student_photos");
    console.log(file);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + Math.floor(Math.random() * 1000) + file.originalname);
    ``;
  },
});
let uploads2 = multer({ storage: student_photo });
var student_photo_upload = uploads2.fields([{ name: "student_img" }]);

//============= All pages are here ============//

app.get("/", (req, res) => {
  console.log("ompawar");
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/m_data", data_serving, (req, res) => {
  let user = req.user;
  let position = user.user_position;
  if (position === "supervisor") {
    if (user.rejected_request.length >= 1) {
      res.status(200).json({
        position: position,
        rejected_request: user.rejected_request[0],
      });
    } else {
      res.status(200).json({ position: position });
    }
  } else {
    if (user.rejected_request.length >= 1) {
      res.status(200).json({
        position: position,
        rejected_request: user.rejected_request[0],
      });
    } else {
      res.status(200).json({ position: "user" });
    }
  }
});

//=============================================//

//============= logoutAll pages are here ============//

app.get("/logoutAll", authentication_logout, async (req, res) => {
  try {
    req.user.tokens = [];

    res.clearCookie("jwt_user");
    console.log("logout succesfully");

    await req.user.save();
    res.status(201).json({
      position: "modal6",
      method: "get",
      headers: {
        "content-type": "application/json",
      },
      body: {
        modal_html: `
            <div class="modal_wrapper no ">
                <div class="modal_container">
                <h2 class="modal_h2" >you have succesfully Logout</h2>
                    <p class="text">you have succesfully logout from all devices and your account data is securly saved. <br> login for getting your account and All Data</p>
                    <div class="action">
                        <a href="/" ><button class="btn_purple">Confirm</button></a>
                        </div>
                        </div>
            </div>`,
      },
    });
  } catch (error) {
    res.send(500).send(error);
  }
});

//=============================================//

//============= Server signin user here ============//

app.post("/submit_result", multiple_upload, async (req, res) => {
  const date = Date(Date.now());

  let token = req.cookies.result_Cookie;
  console.log(token == "uploaded_the_result_today");

  let src;
  let src2;

  try {
    console.log(req.body);
    if (!req.files.your_photo) {
      console.log(req.files, 45);
      src = "user.svg";
    } else {
      src = req.files.your_photo[0].filename;
    }
    if (!req.files.result_photo) {
      console.log(req.files, 45);
      src2 = "user.svg";
    } else {
      src2 = req.files.result_photo[0].filename;
    }
    console.log(src);
  } catch (error) {
    res.status(404).send("file wali baat hai ");
    return;
  }

  if (token == "uploaded_the_result_today") {
    res
      .status(200)
      .send(
        "you already uploaded the result , your result may take some time for aproval ,also you can upload result again after a couple of day thanks"
      );

    fs.stat(`public/uploads/result_folder/${src}`, function (err, stats) {
      // console.log(stats);//here we got all information of file in stats variable

      if (err) {
        return console.error(err);
      }

      if (src == "user.svg") {
      } else {
        fs.unlink(`public/uploads/result_folder/${src}`, function (err) {
          if (err) return console.log(err);
          console.log("file deleted successfully");
        });
      }
    });

    // console.log( `public/uploads/result_folder/${draft_result[0].result_photo}`)
    fs.stat(`public/uploads/result_folder/${src2}`, function (err, stats) {
      // console.log(stats);//here we got all information of file in stats variable

      if (err) {
        return console.error(err);
      }
      if (src2 == "user.svg") {
      } else {
        fs.unlink(`public/uploads/result_folder/${src2}`, function (err) {
          if (err) return console.log(err);
          console.log("file deleted successfully");
        });
      }
    });
    return;
  }
  try {
    // let what = false;

    // if (user.user_position == "supervisor") {
    console.log("super");
    let obj = {
      student: req.body.username,
      your_photo: src,
      class_: req.body.class_,
      session: req.body.session,
      Total_mark: req.body.Total_mark,
      result_photo: src2,
      status: "editable",
      date: date,
    };
    console.log(obj);
    // user.result.push(obj);
    // req.user.save();

    // let current_result = req.user.result.filter((element) => {
    //   return element.date == date;
    // });

    // let id = current_result[0]._id;

    var mydata = new save_result({
      student_name: req.body.username,
      your_photo: src,
      class_: req.body.class_,
      session: req.body.session,
      Total_mark: req.body.Total_mark,
      result_photo: src2,
      date: date,
      // result_id: id,
      // user_id: req.user._id,
    });
    mydata
      .save()
      .then((e) => {
        res.cookie("result_Cookie", "uploaded_the_result_today", {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 36),
          httpOnly: true,
          // secure:true
        });

        res.status(200).sendFile(__dirname + "/public/index.html");
      })
      .catch((error) => {
        res.status(400).send("not saveed 210 " + error);
      });

    return;
    // }

    // user.result.forEach((element) => {
    //   if (
    //     element.class_ === req.body.class_ &&
    //     element.status === "uneditable"
    //   ) {
    //     console.log("rejected request");
    //     res.send("your result is already submitted and approved");
    //     what = true;
    //     return;
    //   }
    // });
    // if (what) {
    //   return;
    // }
    // console.log("element");

    // let ok_edited;

    // user.result.forEach((element) => {
    //   if (
    //     element.class_ === req.body.class_ &&
    //     element.status === "editable"
    //   ) {
    //     ok_edited = true;
    //   } else {
    //     ok_edited = false;
    //   }
    // });

    // res.status(200).sendFile(__dirname + "/public/index.html");
    // console.log(ok_edited);
    // if (ok_edited == true) {
    //   let result_id = "";
    //   console.log(user.result);
    //   user.result = user.result.filter((element) => {
    //     if (
    //       element.class_ === req.body.class_ &&
    //       element.status === "editable"
    //     ) {
    //       result_id = element._id;
    //     } else {
    //       return element;
    //     }
    //   });
    //   console.log(user.result);
    //   console.log(result_id);

    //   let obj = {
    //     student: req.body.username,
    //     your_photo: src,
    //     class_: req.body.class_,
    //     session: req.body.session,
    //     Total_mark: req.body.Total_mark,
    //     result_photo: src2,
    //     status: "editable",
    //     date: date,
    //   };

    //   let delete_document = async (result_id) => {
    //     try {
    //       let result = await save_result.deleteOne({ result_id: result_id });
    //       console.log(result);
    //     } catch (error) {
    //       console.log(error + " in saveing result of user");
    //     }
    //   };
    //   delete_document(result_id);

    //   user.result.push(obj);
    //   req.user.save();

    //   let current_result = req.user.result.filter((element) => {
    //     return element.date == date;
    //   });
    //   let id = current_result[0]._id;

    //   var mydata = new save_result({
    //     student_name: req.body.username,
    //     your_photo: src,
    //     class_: req.body.class_,
    //     session: req.body.session,
    //     Total_mark: req.body.Total_mark,
    //     result_photo: src2,
    //     date: date,
    //     result_id: id,
    //     user_id: req.user._id,
    //   });
    //   mydata
    //     .save()
    //     .then(() => {
    //       res.status(200).sendFile(__dirname + "/public/index.html");
    //     })
    //     .catch((error) => {
    //       res.status(400).send("not saveed 210" + error);
    //     });
    // } else {
    //   let obj = {
    //     student: req.body.username,
    //     your_photo: src,
    //     class_: req.body.class_,
    //     session: req.body.session,
    //     Total_mark: req.body.Total_mark,
    //     result_photo: src2,
    //     status: "editable",
    //     date: date,
    //   };
    //   user.result.push(obj);
    //   req.user.save();

    //   let current_result = req.user.result.filter((element) => {
    //     return element.date == date;
    //   });

    //   let id = current_result[0]._id;

    //   var mydata = new save_result({
    //     student_name: req.body.username,
    //     your_photo: src,
    //     class_: req.body.class_,
    //     session: req.body.session,
    //     Total_mark: req.body.Total_mark,
    //     result_photo: src2,
    //     date: date,
    //     result_id: id,
    //     user_id: req.user._id,
    //   });
    //   mydata
    //     .save()
    //     .then((e) => {
    //       res.status(200).sendFile(__dirname + "/public/index.html");
    //     })
    //     .catch((error) => {
    //       res.status(400).send("not saveed 210" + error);
    //     });
    // }
  } catch (error) {
    res.status(400).send("not saveed 133" + error);
  }
});

//============= Server signin user here ============//

// app.get("/signIn", async (req, res) => {
//   res.sendFile(__dirname + "/public/HTML/signin.html");
// });

// app.post("/signIn", async (req, res) => {
//   try {
//     if (req.body.password == req.body.C_password) {
//       const user_info = await users.find({ user_mobile: req.body.mobile_No });
//       // console.log(user_info[0])
//       let exist = undefined;
//       if (user_info[0] !== undefined) {
//         if (user_info[0].user_mobile == req.body.mobile_No) {
//           exist = true;
//         }
//         console.log(3);
//       }
//       if (exist == true) {
//         res.status(400).send("this mobile exist so login please ");
//         return;
//       }
//       if (exist == undefined) {
//         var mydata = new users({
//           user_name: req.body.username,
//           user_mobile: req.body.mobile_No,
//           user_passward: req.body.password,
//           sign_up_date: Date(Date.now()),
//         });
//         const token = await mydata.generateAuthToken();
//         // console.log(token);
//         console.log("omp 196");

//         res.cookie("jwt_user", token, {
//           expires: new Date(Date.now() + 1000 * 60 * 60 * 3),
//           httpOnly: true,
//           // secure:true
//         });

//         await mydata
//           .save()
//           .then((e) => {
//             res.status(201).redirect("/");
//           })
//           .catch((error) => {
//             res.status(400).send("not saveed 210" + error);
//           });
//       }
//     } else {
//       res.status(400).send("invalid details");
//     }
//   } catch (error) {
//     res.status(400).send("not saveed 216" + error);
//   }
// });

//================================================//

//============= Server login user here ============//

app.get("/logIn", (req, res) => {
  res.sendFile(__dirname + "/public/HTML/login.html");
});

app.post("/logIn", async (req, res) => {
  try {
    const usrename_mobile_no = parseInt(req.body.user_mobile_No);
    const password = req.body.password;
    const user_info = await users.findOne({ user_mobile: usrename_mobile_no });
    const isMatch = await bcrypt.compare(password, user_info.user_passward);
    //   console.log(241 + await bcrypt.compare(password , user_info.user_passward))

    if (isMatch) {
      const token = await user_info.generateAuthToken();

      res.cookie("jwt_user", token, {
        expires: new Date(Date.now() + 36000000),
        httpOnlysd: true,
        // secure:true
      });
      user_info.login_status = true;
      res.status(201).redirect("/");
    } else {
      res.send("passward not matching");
    }
  } catch (error) {
    // res.status(400).sendFile(__dirname + "/public/login.html");
    res.send(error);
  }
});

app.get("/management_console", authentication, (req, res) => {
  res.sendFile(
    __dirname + "/public/Console_management/management_console.html"
  );
});

app.get("/Add_batch", authentication, (req, res) => {
  res.sendFile(
    __dirname + "/public/Console_management/console_forms/Add_batch.html"
  );
});

app.post("/Add_batch", authentication, add_batch);

app.get("/Addmission", authentication, (req, res) => {
  res.sendFile(
    __dirname + "/public/Console_management/console_forms/Admission_form.html"
  );
});

app.post( "/Addmission", authentication, student_photo_upload, async (req, res) => {
    console.log(req.body);

    try {
      let src;
      if (!req.files.student_img) {
        console.log(req.files, 45);
        src = "default.svg";
      } else {
        src = req.files.student_img[0].filename;
      }

      console.log(45);
      
      var Batch = await Batches.findOne({ Batch_code: req.body.Batch_name });
      var Students_count = await Students.countDocuments({});
      console.log(Batch);
      let date = Date(Date.now())

      var mydata = new Students({
        Student_name: req.body.Student_name,
        Father_name: req.body.Father_name,
        Contact_No: req.body.Contact_No,
        School_name: req.body.School_name,
        Address: req.body.Address,
        Addmission_fee: req.body.Addmission_fee,
        Batch: {
          Batch_name: Batch.Batch_name,
          Batch_code: Batch.Batch_code,
          Course_fees: Batch.Course_fees,
        },
        profile_img: src,
        fees_completed : false,
        Course_fees: Batch.Course_fees,
        Creation_date: date,
        serial_number : Students_count+1,
        Main_installment: [
          {
            Amount: req.body.Main_installment,
            added_by_ID: req.user._id,
            added_by_Name: req.user.user_name,
            payment_time: date,
            remove_instalment: false,
          },
        ],
      });
      // console.log(mydata);

      let instalment_id 

      mydata.Main_installment.forEach((element)=>{
        if (element.payment_time == date) {
          instalment_id = element._id
        }
      })

      Batch.students.push(mydata._id);
      await Batch.save();

      let newDate = subtractSeconds(date, 4)


      console.log(newDate)

      let update_obj1 = {
        type_update: "admission",
        done_by_id: req.user._id,
        done_by_name: req.user.user_name,
        student_name: mydata.Student_name,
        profile_img : mydata.profile_img,
        student_id: mydata._id,
        time: new Date(newDate),
      };
      let update_obj2 = {
        type_update: "fees Added",
        done_by_id: req.user._id,
        done_by_name: req.user.user_name,
        student_name: mydata.Student_name,
        student_id: mydata._id,
        fees_amount: req.body.Main_installment,
        profile_img : mydata.profile_img,
        instalment_id : instalment_id , 
        time: date,
      };

      await users.updateMany({}, { $push: { updates: update_obj1 } });
      await users.updateMany({}, { $push: { updates: update_obj2 } });

      await mydata.generateAuthToken();
      mydata
        .save()
        .then((e) => {
          // res.cookie("result_Cookie", "uploaded_the_result_today", {
          //   expires: new Date(Date.now() + 1000 * 60 * 60 * 36),
          //   httpOnly: true,
          //   // secure:true
          // });

          res.status(200).redirect("/management_console");
        })
        .catch((error) => {
          res.status(400).send("not saveed 210 " + error);
        });
    } catch (error) {}
    // res.sendFile(__dirname + "/public/Console_management/console_forms/Admission_form.html");
  }
);

try {
  function subtractSeconds(date, seconds) {
    console.log(date , seconds)
    let newDate = new Date(date);
    console.log(newDate)
    newDate.setSeconds(newDate.getSeconds() - seconds);
    console.log(newDate)
    return newDate;
  }
} catch (error) {
  console.log(error)
}
// subtractSeconds(Date(Date.now()) , 4)

//============= Server Listning here ============//
http.listen(port, "0.0.0.0", () => {
  console.log(`the app is runing at port http://localhost:${port}`);
});

//==============PRODUCT SHORTING ALGO IS HERE=================//
const give_draft_result = async (count, length) => {
  let prd_array = await save_result.collection
    .countDocuments()
    .then((value) => {
      if (value <= length) {
        return (product_array = []);
      } else {
        const query = {};
        const limit = 4;
        if (value > 4) {
          let product_array = save_result.find(query).skip(length).limit(limit);
          return product_array;
        } else {
          if (count < 2) {
            let product_array = save_result.find(query);
            return product_array;
          }
        }
      }
    });
  return prd_array;
};

const result_for_page = async (count, length) => {
  let product_array = [];
  let result_main_array = await approved_result.find({});

  result_main_array = result_main_array.sort((character1, character2) => {
    if (character1.Total_mark > character2.Total_mark) {
      return -1;
    }
    if (character1.Total_mark < character2.Total_mark) {
      return 1;
    }
    return 0;
  });

  let value = result_main_array.length;
  let limit = 9;
  // console.log(value, count);
  if (value <= length) {
    return (product_array = []);
  } else {
    // console.log(value > 10);
    if (value >= 10) {
      let product_array = result_main_array.slice(
        count * limit - 9,
        limit * count
      );
      // console.log(product_array);

      return product_array;
    } else {
      if (count <= 1) {
        let product_array = result_main_array;
        return product_array;
      }
    }
  }

  // return result_main_array;
};

const result_specific = async (class_, count, length) => {
  let result_main_array = [];
  if (class_ == 11) {
    let array1 = await approved_result.find({ class_: "11(bio)" });
    let array2 = await approved_result.find({ class_: "11(maths)" });
    result_main_array = result_main_array.concat(array1, array2);
  } else if (class_ == 12) {
    let array1 = await approved_result.find({ class_: "12(bio)" });
    let array2 = await approved_result.find({ class_: "12(maths)" });
    result_main_array = result_main_array.concat(array1, array2);
  } else {
    let array1 = await approved_result.find({ class_: "10" });
    result_main_array = array1;
  }

  result_main_array = result_main_array.sort((character1, character2) => {
    if (character1.Total_mark > character2.Total_mark) {
      return -1;
    }
    if (character1.Total_mark < character2.Total_mark) {
      return 1;
    }
    return 0;
  });

  let value = result_main_array.length;
  console.log(length);
  let limit = 9;
  if (value <= length) {
    return (product_array = []);
  } else {
    console.log(value > 10);
    if (value > 10) {
      let product_array = result_main_array.slice(
        count * limit - 9,
        limit * count
      );
      return product_array;
    } else {
      if (count <= 1) {
        let product_array = result_main_array;
        return product_array;
      }
    }
  }
};

//==============PRODUCT SHORTING ALGO IS HERE=================//
const result_for_slider = async () => {
  let result_arr = await approved_result.find({});

  const sortByName = result_arr.sort((character1, character2) => {
    if (character1.Total_mark > character2.Total_mark) {
      return -1;
    }
    if (character1.Total_mark < character2.Total_mark) {
      return 1;
    }
    return 0;
  });
  // console.log(sortByName);

  let real_result = sortByName.slice(0, 9);
  return real_result;
};

// const socket = require("socket.io-client")("https://example.com");

io.on("connection", async (socket) => {
  console.log("Connected...");
  socket.on("confirm", () => {
    console.log("user connectiion confirm...");
  });

  socket.on("give-result-specific", async (count, length, class_) => {
    const result_array = await result_specific(class_, count, length);
    socket.emit("take-result-specific", result_array);
  });

  // result serving system is here
  socket.on("give-result-slider", async () => {
    const result_array = await result_for_slider();
    socket.emit("take-result-slider", result_array);
  });

  socket.on("give-result-page", async (count, length) => {
    const result_array = await result_for_page(count, length);
    socket.emit("take-result-page", result_array);
  });

  // approveing system is here
  socket.on("approve-this-result", async (_id) => {
    try {
      const token_obj = cookie.parse(socket.handshake.headers.cookie);
      const token = token_obj.jwt_user;
      const verifyUser = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
      const user = await users.findOne({ _id: verifyUser._id });

      if (user.user_position == "supervisor") {
        let confirmation = approving_func(_id);
        if (confirmation) {
          socket.emit("approvation-confirm", _id);
        }
      }
    } catch (error) {}
  });

  // deleteing draft_result
  socket.on("remove-from-draft", async (_id) => {
    try {
      const token_obj = cookie.parse(socket.handshake.headers.cookie);
      const token = token_obj.jwt_user;
      const verifyUser = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
      const user = await users.findOne({ _id: verifyUser._id });
      // console.log(user)

      if (user.user_position == "supervisor") {
        let draft_result = await save_result.findOne({ _id: _id });
        console.log(draft_result)

        console.log( `public/uploads/result_folder/${draft_result.your_photo}`)
        fs.stat(
          `public/uploads/result_folder/${draft_result.your_photo}`,
          function (err, stats) {
            // console.log(stats);//here we got all information of file in stats variable

            if (err) {
              return console.error(err);
            }

            if (draft_result.your_photo == "user.svg") {
            } else {
              fs.unlink(
                `public/uploads/result_folder/${draft_result.your_photo}`,
                function (err) {
                  if (err) return console.log(err);
                  console.log("file deleted successfully");
                }
              );
            }
          }
        );

        // console.log( `public/uploads/result_folder/${draft_result[0].result_photo}`)
        fs.stat(
          `public/uploads/result_folder/${draft_result.result_photo}`,
          function (err, stats) {
            console.log(stats);//here we got all information of file in stats variable

            if (err) {
              return console.error(err);
            }
            if (draft_result.result_photo == "user.svg") {
            } else {
              fs.unlink(
                `public/uploads/result_folder/${draft_result.result_photo}`,
                function (err) {
                  if (err) return console.log(err);
                  console.log("file deleted successfully");
                }
              );
            }
          }
        );
        // await student.save();
        await save_result.deleteOne({ _id: _id });
      }

      socket.emit("ok-deleted-result", _id);
    } catch (error) {
      console.log(error + " in saveing result of user");
    }
  });

  socket.on("showed_rejected", async (_id) => {
    const token_obj = cookie.parse(socket.handshake.headers.cookie);
    const token = token_obj.jwt_user;
    const verifyUser = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    const user = await users.findOne({ _id: verifyUser._id });

    let mongo = require("mongodb");
    let id = new mongo.ObjectId(_id);
    console.log(id);

    user.rejected_request = user.rejected_request.filter((element) => {
      console.log(id.toString() == element._id.toString());
      return id.toString() !== element._id.toString();
    });
    await user.save();
  });

  // sending products
  socket.on("draft_result", async (count, length) => {
    console.log(count);
    let draft_result = await give_draft_result(count, length);
    const token_obj = cookie.parse(socket.handshake.headers.cookie);
    const token = token_obj.jwt_user;
    const verifyUser = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    const user = await users.findOne({ _id: verifyUser._id });
    // console.log(user)

    if (user.user_position == "supervisor") {
      socket.emit("take_draft_result", draft_result);
    }
  });

  // giving menu here
  socket.on("menu-please", async (info) => {
    console.log(info + 234);
    try {
      if (info === "loged_in") {
        let menu = [
          { name: "topper", herf: "HTML/topper.html" },
          { name: "Logout", herf: "logoutAll" },
          { name: "Batches", herf: "HTML/fee_structure.html" },
          { name: "Post Result", herf: "HTML/result_form.html" },
          { name: "About Us", herf: "HTML/about.html" },
        ];
        socket.emit("take-menu", menu);
      } else if (info === "remain") {
        let menu = [
          { name: "topper", herf: "HTML/topper.html" },
          // { name: "Log in", herf: "logIn" },
          // { name: "Sign in", herf: "signIn" },
          { name: "Batches", herf: "HTML/fee_structure.html" },
          { name: "About Us", herf: "HTML/about.html" },
          { name: "Post Result", herf: "HTML/result_form.html" },
        ];
        socket.emit("take-menu", menu);
      } else if (info === "supervisor") {
        let menu = [
          { name: "topper", herf: "HTML/topper.html" },
          { name: "Logout", herf: "logoutAll" },
          { name: "Post Result", herf: "HTML/result_form.html" },
          { name: "Draft Result", herf: "HTML/draft_result.html" },
          { name: "Batches", herf: "HTML/fee_structure.html" },
          { name: "About Us", herf: "HTML/about.html" },
          { name: "Console", herf: "management_console" },
        ];
        socket.emit("take-menu", menu);
      }
    } catch (error) {
      console.log(error);
    }
  });

  // ================= LIKING SOCKET SYSTEMS =================//

  // ================= AUTHENTICATED USER CODE =================//

  if (socket.managers) {
    socket.on("give_batches", async () => {
      let batches = await Batches.find({});
      let batch_data = [];
      batches.forEach((element) => {
        let object = {
          _id: element._id,
          Batch_name: element.Batch_name,
          Batch_code: element.Batch_code,
        };
        batch_data.push(object);
      });

      socket.emit("take_batches", batch_data);
    });
    socket.on("give_students", async (_id, Batch_code) => {
      // let batches = await Batches.find({ _id })
      let student = await Students.find({});

      let student_obj = [];


      student.forEach((element) => {
        if (element.Batch.Batch_code == Batch_code) {
          let object = {
            _id: element._id,
            Student_name: element.Student_name,
            Main_installment: element.Main_installment,
            profile_img: element.profile_img,
            Batch: element.Batch,
            fees_completed : element.fees_completed,
            next_expected_date : element.next_expected_date
          };

          let total_paid_fees = 0
          element.Main_installment.forEach(element => {
            if (element.remove_instalment != true) {
              total_paid_fees += element.Amount
            }
          });
          object.total_paid_fees = total_paid_fees

          student_obj.push(object);
        }
      });

      student_obj = student_obj.sort((a, b) => a.total_paid_fees - b.total_paid_fees);
      // console.log(student_obj)
      socket.emit("take_students", student_obj);
    });

    socket.on("give_amount_presets", async() => {
      
      let user = await users.findOne({_id : socket.managers._id})
      // console.log(user.Amount_presets)

      socket.emit("take_amount_presets", user.Amount_presets);

    });

    socket.on("add_fee_of_student", async (object) => {

      if (object.set_preset) {
        try {
          let user = await users.findOne({_id : socket.managers._id})
      
          let do_or_not = true
          user.Amount_presets.forEach(element => {
            if (element ==  object.Amount) {
              do_or_not= false
              return
            }
          });
        
          if (do_or_not) {
            user.Amount_presets.push(object.Amount)
          }
          // console.log(user.Amount_presets)
        
          await user.save()
        } catch (error) {
          console.log(error)
        }
      
      }


      let date = Date(Date.now()) 
      let instalment_object = {
        Amount: object.Amount,
        added_by_ID: socket.managers._id,
        added_by_Name: socket.managers.user_name,
        payment_time: date,
        remove_instalment: false,
      };
      // await student.Main_installment.push()
      let student = await Students.findOneAndUpdate(
        { _id: object._id },
        { $push: { Main_installment: instalment_object } }
      ).catch(err=>{
        console.log(err)
      });

      let after_std = await Students.findOne({_id : object._id})

      let instalment_id 


      after_std.Main_installment.forEach((element)=>{
        if (element.payment_time == date) {
          instalment_id = element._id
          console.log(element._id)
        }
      })
      // let date2 = Date(Date.now())
      let update_obj2 = {
        type_update : "fees Added",
        done_by_id :  socket.managers._id,
        done_by_name : socket.managers.user_name,
        student_name : student.Student_name,
        student_id : student._id,
        instalment_id : instalment_id , 
        fees_amount : object.Amount,
        profile_img : student.profile_img,  
        time : date,
      }
      await users.updateMany({}, { $push: { updates: update_obj2 } });
      socket.emit("fees_updated_of" , update_obj2 )
    });

    socket.on("give_this_student_data" , async _id=>{
      let student = await Students.findOne({_id});
      socket.emit("take_this_student_data" , student )
    })
    socket.on("give_this_student_data_for_update" , async _id=>{
      let student = await Students.findOne({_id});
      socket.emit("take_this_student_data_for_update" , student )
    })

    socket.on("Add_recipt_number" , async data=>{
      console.log(data)

      try {


        const filter = { _id: data.student_id, "Main_installment._id": data.instalment_id };
        const update = {
        $set: { "Main_installment.$.recipt_No": data.recipt_No }
        };
        const student = await Students.updateOne(filter, update);

        console.log(student)
        console.log(`Matched ${student.matchedCount} document(s) and modified ${student.modifiedCount} document(s)`);


        let update_obj 
        let user1 = await users.findOne({_id : socket.managers._id} )
        user1.updates.forEach(element=>{
          console.log(element._id == data.update_id) 
          if (element._id == data.update_id) {
             update_obj = element
             update_obj.recipt_No = data.recipt_No 
            }
        })
            
        console.log(update_obj)

        const filter_up = { "updates.student_id": data.student_id , "updates.time": update_obj.time };
        const update_up = {
          $set: { "updates.$.recipt_No": data.recipt_No }
        };

        let result = await users.updateMany(filter_up, update_up).catch(error=>{
          console.log(error)
        })
        console.log(result)
        console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s)`);

        let update_obj2 
        let user = await users.findOne({_id : socket.managers._id} )
        
        user.updates.forEach(element=>{
          if (element._id == data.update_id) {
             update_obj2 = element
             console.log(element)
            }
        })
        console.log(update_obj2)
        socket.emit("recipt_number_updated" , update_obj2)
        
      } catch (error) {
        console.log(error)
      }

    });



    socket.on("give_updates" , async()=>{
      socket.managers._id
      let manager = await users.findOne({_id : socket.managers._id})

      if (manager && manager.updates && Array.isArray(manager.updates)) {
        // Sort the updates array by date in descending order
        let data_to_send = manager.updates.sort((b, a) => new Date(b.time) - new Date(a.time));
  
        // Update the document with the sorted updates array
        console.log(data_to_send)
        // await collection.updateOne(filter, { $set: { updates: document.updates } });
        socket.emit("take_updates" , data_to_send )
  
        console.log('Document updated successfully with sorted updates.');
      } else {
        console.log('Document not found or updates field is not an array.');
      }

      try {
        
      } catch (error) {
        console.log(error)
      }
      // let data_to_send = manager.updates.sort(function (a, b) {
    
      //   return b.time
      //     .toDateString()
      //     .localeCompare(a.time.toDateString());
      // });
      // socket.emit("take_updates" , data_to_send )
    })

    socket.on("search_student" ,async  value=>{
      let students = await Students.find({});

      let student_obj = [];


      students.forEach((element) => {
          let object = {
            _id: element._id,
            Student_name: element.Student_name,
            Main_installment: element.Main_installment,
            profile_img: element.profile_img,
            Batch: element.Batch,
            next_expected_date : element.next_expected_date ,
            fees_completed: element.fees_completed
          };

          let total_paid_fees = 0
          element.Main_installment.forEach(element => {
            if (element.remove_instalment != true) {
              total_paid_fees += element.Amount
            }
          });
          object.total_paid_fees = total_paid_fees
          student_obj.push(object);
      });

      student_obj = student_obj.sort((a, b) => a.total_paid_fees - b.total_paid_fees);
      // console.log(student_obj)
      
      
      const filteredStudents = student_obj.filter(student => student.Student_name.toLowerCase().includes(value.toLowerCase()));

      socket.emit("take_students", filteredStudents);
    })


    socket.on("filter_student" , async (Filter_amount , type , Batch_code)=>{
      console.log(Filter_amount , type , Batch_code)

      let students = await Students.find({});

      let student_obj = [];



      students.forEach((element) => {
        if (element.Batch.Batch_code == Batch_code) {
          let object = {
            _id: element._id,
            Student_name: element.Student_name,
            Main_installment: element.Main_installment,
            profile_img: element.profile_img,
            Batch: element.Batch,
            fees_completed: element.fees_completed ,
            next_expected_date : element.next_expected_date
          };

          let total_paid_fees = 0
          element.Main_installment.forEach(element => {
            if (element.remove_instalment != true) {
              total_paid_fees += element.Amount
            }
          });
          object.total_paid_fees = total_paid_fees

          if (type == "less") {
            if (total_paid_fees < Filter_amount ) {
              student_obj.push(object);
            }
          }else if (type == "more") {
            if (total_paid_fees > Filter_amount ) {
              student_obj.push(object);
            }
          }
              
              // student_obj.push(object);

          
        }
      });

      student_obj = student_obj.sort((a, b) => a.total_paid_fees - b.total_paid_fees);

      // console.log(student_obj)
      
      
      // const filteredStudents = student_obj.filter(student => student.Student_name.toLowerCase().includes(value.toLowerCase()));

      socket.emit("take_students", student_obj);
    } )


    socket.on("complete_fees" ,async  (_id, todo)=>{
      await Students.updateOne({_id} , { $set: { fees_completed: todo }});
      let student = await Students.findOne({_id});

      console.log(student)

      socket.emit("marked_completed_fees", student)
    })

    socket.on("set_Next_expected_date" , async (new_date , fee_Amount , _id)=>{
      let object = {
        date : new_date,
        Amount :fee_Amount
      }
      await Students.updateOne({_id} , {$set : {next_expected_date : object}});
      let student = await Students.findOne({_id});
      console.log(student)
      socket.emit("seted_Next_expected_date" ,student)
    })

    socket.on("remove_this_installment" , async (_id , student_id ,reason)=>{
      const update = {
        $set: { "Main_installment.$.remove_instalment": true , "Main_installment.$.remove_reason": socket.managers.user_name + " =>  " +reason }
        };
      let result = await Students.updateOne({_id : student_id , "Main_installment._id": _id } , update);
      console.log(result)

      let student = await Students.findOne({_id : student_id})
      socket.emit("take_this_student_data" , student )
      socket.emit("take_this_student_data_for_update" , student )
    })
    
    socket.on("remove_remove_this_installment" , async (_id , student_id ,reason)=>{
      const update = {
        $set: { "Main_installment.$.remove_instalment": false , "Main_installment.$.remove_reason": undefined }
        };
      let result = await Students.updateOne({_id : student_id , "Main_installment._id": _id } , update);
      console.log(result)

      let student = await Students.findOne({_id : student_id})
      socket.emit("take_this_student_data" , student )
      socket.emit("take_this_student_data_for_update" , student )
    })



  }
  // ================= AUTHENTICATED USER CODE =================//







  // ================= DISCONECT INFORMER =================//
  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected");
  });
});






