socket.emit("give_batches");

socket.on("take_batches", (data) => {
  // console.log(data);

  data.forEach((element) => {
    let batch_box = document.createElement("div");
    batch_box.className = "batch_box";
    batch_box.setAttribute("onclick", "get_students(this)");
    batch_box.id = element._id;
    batch_box.innerHTML = `
        <div class="code_box">${element.Batch_code}</div>
        <div class="Batch_name">Class ${element.Batch_name}</div>
        `;
    document.getElementById("slider_container_batch").append(batch_box);
  });
});

let Batch_code 
let Batch_name
let get_students = (element) => {
  let id = element.id;
  Batch_code = element.children[0].textContent;
  Batch_name = element.children[1].textContent;


  console.log(Batch_name)

  document.getElementById("filter_container_slider").classList.remove("display_none")

  let Batch_heading = document.getElementById("Batch_heading")
  Batch_heading.textContent = element.children[1].textContent

  let student_unit = document.getElementById("student_unit")
  
  student_unit.innerHTML = ""
  socket.emit("give_students", id, Batch_code);
};


let student_array = []

socket.on("take_students", data =>{
  // console.log(data)


  let slider_box = document.getElementById("slider_box")
  if (!slider_box.classList.contains("slider_box_close")) {
    slider_function()
  }
  let student_unit = document.getElementById("student_unit")
  
  student_unit.innerHTML = ""
    student_array = data
    data.forEach(element=>{
      // console.log(element)

      rendering_single_doc(element , "array")

    })
});

// console.log(student_array)


let batch
function rendering_single_doc(element , render_type){
    batch = element.Batch

      let total_paid_fees = 0
      let Course_fees = element.Batch.Course_fees
      element.Main_installment.forEach(element=>{
        if (element.remove_instalment != true) {
          total_paid_fees += element.Amount
        }
      })
      let last_payment_obj = element.Main_installment[element.Main_installment.length -1]
        console.log(element.next_expected_date)
      
      let NED_amount
      let NED
      if (element.next_expected_date == undefined) {
        NED = undefined
        NED_amount = ""
      }else{
        NED = formatDate(new Date(element.next_expected_date.date))
        if (element.next_expected_date.Amount == undefined) {
          NED_amount = ""
        }else{
          NED_amount = element.next_expected_date.Amount + " INR"
        }
      }

    


      let percentage = total_paid_fees*100/Course_fees
      if (percentage > 100) {
        percentage = 100
      }


      let display_none
      if (element.fees_completed == true) {
        display_none = ""
        display_none2 = "display_none"
      }else if(element.fees_completed == false){
        display_none = "display_none"
        display_none2 = ""
      }


      let student_unit = document.getElementById("student_unit")
      
      let student_box = document.createElement("div")
      student_box.setAttribute("onclick" , "open_student_box(event , this , '')")
      student_box.className = "student_box"
      student_box.id = element._id

      student_box.innerHTML = `
        <div class="upper_box">
          <div class="img_box">
          <img src="/uploads/student_photos/${element.profile_img}" alt="">
          </div>
          <div class="name_box">
            <p>${element.Student_name}</p>
            <p class="fees_text">Paid ${total_paid_fees} INR</p>
          </div>
          <div class="circle_btn ${display_none}">
            <svg
              width="17"
              height="12"
              viewBox="0 0 17 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 5.03589L5.52678 10.3171"
                stroke="#ffffff"
                stroke-width="3"
                stroke-linecap="round"
              ></path>
              <path
                d="M15.8281 1L5.70867 10.4573"
                stroke="#ffffff"
                stroke-width="3"
                stroke-linecap="round"
              ></path>
            </svg>
          </div>
        </div>

        <div class="bottom_box closed_detail">
          <div class="data_box">
            <p class="head_data">last Expected Date</p>
            <div class="main_data_box">
              <div class="date_box">${NED}</div>
              <div class="Amount">${NED_amount}</div>
            </div>
          </div>
          <div class="data_box">
            <p class="head_data">last payment Date</p>
            <div class="main_data_box">
              <div class="date_box">${formatDate(new Date(last_payment_obj.payment_time))}</div>
              <div class="date_box recipt_no">R- ${last_payment_obj.recipt_No}</div>
              <div class="Amount">${last_payment_obj.Amount} INR</div>
            </div>
          </div>
          <div class="data_box">
            <p class="head_data">Total Fees Payed</p>
            <div class="fee_bar">
              <div class="fee_bar_filler" style="width: ${percentage}%;   transition: 6s;"></div>
            </div>
            <div class="main_data_box">
              <div class="bar_value">${total_paid_fees} INR</div>
              <div class="bar_value">${Course_fees} INR</div>
            </div>
          </div>
          <div class="button_box">
            <button class="button" onclick="Student_detail_function('${element._id}')" id="detail_BTN">
              <svg
                width="22"
                height="25"
                viewBox="0 0 22 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="1"
                  y="1"
                  width="20"
                  height="23"
                  rx="3"
                  stroke="white"
                  stroke-width="2"
                />
                <path
                  d="M5 6.5H17"
                  stroke="white"
                  stroke-width="3"
                  stroke-linecap="round"
                />
                <path d="M5 12H17" stroke="white" stroke-linecap="round" />
                <path d="M5 15H17" stroke="white" stroke-linecap="round" />
                <path d="M5 18H17" stroke="white" stroke-linecap="round" />
              </svg>
            </button>
            <button class="button" onclick="add_expexted_date(this , '${element._id}' , '${element.Student_name}' )" id="NED_BTN">ned</button>
            <button class="button ${display_none2}" onclick="add_fees(this)">Add fees</button>
          </div>
        </div>
      `

      if (render_type  == "array") {
        student_unit.appendChild(student_box)
      }else if (render_type == "update") {
        document.getElementById(element._id).replaceWith(student_box)
        document.getElementById(element._id)

        open_student_box( undefined , document.getElementById(element._id) )

      }
}
























let add_fees = (element) => {
  let id = element.parentElement.parentElement.parentElement.id;
  let student_obj;
  student_array.forEach((element) => {
    if (element._id == id) {
      student_obj = element;
    }
  });

  let total_paid_fees = 0
  student_obj.Main_installment.forEach(element2=>{
    if (element2.remove_instalment != true) {
      total_paid_fees += element2.Amount
    }
  })


  let modal_wrapper = document.createElement("div");
  modal_wrapper.classList = "modal_wrapper no";
  modal_wrapper.innerHTML = `
          <div class="modal_container">
          <button class="close">&times;</button>
          <div class="heading_slider Modal_heading_slider">
            <div class="blue_dot blue_dot_big modal_blue_dot_big"></div>
            <div class="head_text head_text_big">Add student Fees</div>
          </div>
          <!-- <p class="text">If you already Rk coaching student then create your account click on Sign Up</p>
            <div class="action">
            <a href="/signIn" ><button class="btn_purple">Sign Up</button></a>
                <a href="/HTML/login.html" ><button class="btn_purple">Login</button></a>
            </div> -->
          <form onsubmit="fee_addition_func(event , ${total_paid_fees})" id="form_signIn">
            <div>
              <br />
              <p class="_inp_disclamer">
                Please Recheck the name of the student and enter correct Amount
              </p>
              <br />
              <br />
            </div>

            <div class="upper_box">
              <div class="img_box"></div>
              <div class="name_box">
                <p>${student_obj.Student_name}</p>
                <p class="fees_text">Paid ${total_paid_fees} </p>
              </div>
            </div>

            <br />
            <br />
            <!-- user mobile number -->
            <p  class="label_inp">Amount</p>
            <input
              type="text"
              name="Amount"
              class ="${id}"
              id="Special_inp"
              placeholder="Enter Amount"
              required
            />
            <label class="check_presets_label" for="check_presets">
              <input type="checkbox" name="check_presets" id="check_presets" />
              Save in preset
            </label>
  
            <br />

            <div class="preset_box">
              <h5 class="heading_presets">Presets</h5>
              <div class="all_presets" id="all_presets">
           
              </div>
            </div>
            <div class="btn_s" class="main_btn">
              <input
                type="submit"
                id="submit"
                class="main_btn"
                value="Add Fees"
              />
            </div>
          </form>
        </div>
    `;
  document.getElementById("modal_main").appendChild(modal_wrapper);
  socket.emit("give_amount_presets")
  modal_js();
};

async function fee_addition_func(event , total_paid_fees) {
  // first form submited # user_nsme & mobile number is sended

  event.preventDefault();

  
  let fee_Amount = document.getElementById("Special_inp").value;
  console.log(parseInt(total_paid_fees), parseInt(fee_Amount)  )
  console.log(parseInt(total_paid_fees)+parseInt(fee_Amount) > batch.Course_fees + 500 )

  if (fee_Amount < 0 ) {
    event.target.reset();
    alert("fees Amount cannot be negative")
    return
  }else if (parseInt(total_paid_fees)+parseInt(fee_Amount) > batch.Course_fees + 500 ) {
    event.target.reset();
    let answer = confirm("the Amount of the you entered is " +fee_Amount + " and he paid " + total_paid_fees + " which exceeds the batch fees so do you want add the fees")
    if (answer) {
      
    }else{
      return
    }
  }
  let id = document.getElementById("Special_inp").className;
  console.log(id)
  let checkbox_ = document.getElementById("check_presets").checked;

  console.log(fee_Amount , checkbox_)

  document.getElementById("submit").disabled = true;

  let objectToSend = {
    Amount :fee_Amount,
    set_preset : checkbox_,
    _id : id
  }

  await socket.emit("add_fee_of_student" , objectToSend);

  // modal_box.innerHTML = `<div class="unit_container modal_unit_console" id="modal_unit_console">
  // <div class="loader_box">
  // <div class="loader "></div>
  // </div>
  // </div>`;
}


socket.on("fees_updated_of" , object =>{
    console.log(object)
    let modal_wrapper = document.createElement("div");
    modal_wrapper.classList = "modal_wrapper";
    modal_wrapper.innerHTML = `
            <div class="modal_container">
            <button class="close">&times;</button>
            <div class="heading_slider Modal_heading_slider">
              <div class="blue_dot blue_dot_big modal_blue_dot_big"></div>
              <div class="head_text head_text_big">Fees Added</div>
            </div>
           <br />
              <div class="upper_box">
                <div class="img_box"></div>
                <div class="name_box">
                  <p>${object.student_name}</p>
                  <p class="fees_text">Fees Added</p>
                </div>
              </div>
  
              <br />


              
            <p class="text">fees of the student ${object.student_name} is succesfully added of amount ${object.fees_amount} </p>
               <br />   <br />
    

            <div class="action">
              <button onclick="modal_js('close_this');" id="submit" class="btn_purple main_btn">Confirm</button></a>
            </div>
            
          </div>
      `;
    document.getElementById("modal_main").innerHTML = ""
    document.getElementById("modal_main").appendChild(modal_wrapper);
    modal_js();

    console.log(object.student_id)
    socket.emit("give_this_student_data_for_update" , object.student_id)
})







socket.on("take_amount_presets" , data=>{
  // <div onclick="fill_inp(this)" class="preset">1000</div>
  // console.log(data)
  data.forEach(element=>{
    let all_presets = document.getElementById("all_presets")
    let preset = document.createElement("div")
    preset.className = "preset"
    preset.setAttribute("onclick" , "fill_inp(this)")
    preset.innerHTML = element
    all_presets.appendChild(preset)
  })
})


