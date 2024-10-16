let slider_function = () => {
  let slider_box = document.getElementById("slider_box");
  let slide_wraper = document.getElementById("slide_wraper");

  if (slider_box.classList.contains("slider_box_close")) {
    slider_box.classList.remove("slider_box_close");
    slide_wraper.classList.remove("slide_wraper_close");
  } else if (!slider_box.classList.contains("slider_box_close")) {
    slider_box.classList.add("slider_box_close");
    slide_wraper.classList.add("slide_wraper_close");
  }
};

let open_student_box = (event, element) => {
  if (event) {
    if (event.target.classList.contains("button")) {
      return;
    }
  }
  element.children[1].classList.add("in_process");
  let bottom_boxs = document.getElementsByClassName("bottom_box");
  Array.from(bottom_boxs).forEach((element2) => {
    if (element2.classList.contains("in_process")) {
    } else {
      element2.classList.add("closed_detail");
    }
  });

  if (element.children[1].classList.contains("closed_detail")) {
    element.children[1].classList.remove("closed_detail");
    element.children[1].classList.remove("in_process");
  } else {
    element.children[1].classList.add("closed_detail");
    element.children[1].classList.remove("in_process");
  }
};





function fill_inp(element) {
  document.getElementById("Special_inp").value = element.textContent;
}

function formatDate(date) {
  if (date == "Invalid Date") {
    return undefined
  }
  let day = date.getDate();
  let monthIndex = date.getMonth();
  let year = date.getFullYear();

  // Array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the month name
  let monthName = monthNames[monthIndex];

  // Add leading zero to day if needed
  if (day < 10) {
    day = "0" + day;
  }

  return `${day}-${monthName}-${year}`;
}




let Student_detail_function = (_id) => {
  console.log(_id);

  let detail_container = document.getElementById("detail_container");
  detail_container.innerHTML = "";
  detail_container.classList.remove("detail_container_closed");

  socket.emit("give_this_student_data", _id);
  // create_detail_container(_id)
  window.history.pushState({ page: 2 }, '', window.location.href);
};
let close_detail_box = () => {
  let detail_container = document.getElementById("detail_container");
  detail_container.innerHTML = "";
  detail_container.classList.add("detail_container_closed");
  window.history.pushState({ page: 1 }, '', window.location.href);
};

window.addEventListener('popstate', function(event) {
  close_detail_box();
});





socket.on("take_this_student_data", (data) => {
  // precentage_caculator

  let total_paid_fees = 0;
  let Course_fees = data.Batch.Course_fees;
  data.Main_installment.forEach((element) => {
    console.log(element.remove_instalment != true)
    if (element.remove_instalment != true) {
      total_paid_fees += element.Amount
    }
  });

  let percentage = (total_paid_fees * 100) / Course_fees;

  if (percentage > 100) {
    percentage = 100;
  }
  // precentage_caculator

  // complete_button

  let BTNtext = "Completed";
  if (data.fees_completed == true) {
    BTNtext = "Completed";
    todo = false;
  } else {
    BTNtext = "Do Complete";
    todo = true;
  }

  // complete_button

  let detail_container = document.getElementById("detail_container");
  detail_container.innerHTML = `
        <nav class="nav_detail_box">
        <!-- ======COMPANY LOGO======= -->
        <div id="Company_logo" class="company_logo">
          <!-- ======MENU ICON BUTTON======= -->
          <div class="menu_icon back_arrow_box" onclick="close_detail_box()">
            <svg width="69" height="28" viewBox="0 0 69 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.23223 17.2322C0.25592 18.2085 0.25592 19.7915 1.23223 20.7678L17.1421 36.6777C18.1184 37.654 19.7014 37.654 20.6777 36.6777C21.654 35.7014 21.654 34.1184 20.6777 33.1421L6.53553 19L20.6777 4.85786C21.654 3.88155 21.654 2.29864 20.6777 1.32233C19.7014 0.34602 18.1184 0.34602 17.1421 1.32233L1.23223 17.2322ZM69 16.5L3 16.5V21.5L69 21.5V16.5Z" fill="black"/>
              </svg>
              
          </div>

          <!-- ======MENU ICON BUTTON======= -->
          <object
            data="SVG/Company_logo.svg"
            type="image/svg+xml"
            class="logo"
            id="logo"
          ></object>
        </div>

        <!-- ======MENU BUTTON======= -->
        <div id="menu_button_section">

          <div id="complete_button" onclick="complete_fees('${total_paid_fees}','${data.Batch.Course_fees}','${data._id}' ,'${data.Student_name}' , '${data.profile_img}', ${todo})">
                  <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5.03589L5.52678 10.3171" stroke="#ffffff" stroke-width="3" stroke-linecap="round"></path>
                  <path d="M15.8281 1L5.70867 10.4573" stroke="#ffffff" stroke-width="3" stroke-linecap="round"></path>
                  </svg>
              <div>${BTNtext}</div>
              
          </div>
          <!-- ======MENU BUTTON======= -->
        </div>
      </nav>
      <div class="student_info_container">
        <div id="Page_name" class="Page_name">
          <h2>Student Info</h2>
          
        </div>
        <div class="student_box" >
          <div class="upper_box">
            <div class="img_box">
            <img src="/uploads/student_photos/${data.profile_img}" alt="">
            </div>
            <div class="name_box">
              <p>${data.Student_name}</p>
               <p class="fees_text">Paid ${total_paid_fees} INR</p>
            </div>
          </div>
        </div>


        <h2>Fees history</h2>
        <div class="fee_info_box" id="fee_info_box">
 
        </div>

        <div class="bottom_info">
          <div class="data_box">
            <p class="head_data">Paid till now</p>
            <div class="fee_bar">
              <div class="fee_bar_filler" style="width: ${percentage}%;"></div>
            </div>
            <div class="main_data_box">
              <div class="bar_value">${total_paid_fees} INR</div>
                <div class="bar_value">${Course_fees} INR</div>
            </div>
          </div>
        </div>

      </div>
  `;

  let fee_info_box = document.getElementById("fee_info_box");

  data.Main_installment.forEach((element) => {

    let display_none = element.remove_instalment ? "" : "display_none";
    let function_type = element.remove_instalment ? "remove_remove_this_fees" : "remove_this_fees";
    console.log(element.remove_instalment)
    console.log(function_type)

    let remove_reason = element.remove_reason == undefined ? "" : element.remove_reason;


    let data_box = document.createElement("div");
    data_box.className = "data_box";
    data_box.setAttribute("onclick" , `${function_type}('${element._id}' , '${data._id}')`)
    let br = document.createElement("hr");
    data_box.innerHTML = `
        <p class="head_data">${element.added_by_Name}</p>
    <div class="main_data_box">
      <div class="date_box">${formatDate(new Date(element.payment_time))}</div>
      <div class="date_box recipt_no">R- ${element.recipt_No} </div>
      <div class="Amount">${element.Amount} INR</div>
    </div>
    <div class="remove_box ${display_none}">
      <div class="Removed_head">^ Removed </div>
      <p class="remove_reason">${remove_reason}</p>
    </div>
    `;
    fee_info_box.prepend(data_box);
    fee_info_box.prepend(br);
  });
});








function complete_fees( total_paid_fees, Course_fees, _id, Student_name, profile_img, todo) {
  
  if (todo == true) {
    console.log(total_paid_fees, Course_fees, _id, todo); 
    if (parseInt(total_paid_fees) < parseInt(Course_fees)) {
      let modal_wrapper = document.createElement("div");
      modal_wrapper.className = "modal_wrapper";
      modal_wrapper.innerHTML = `
            <div class="modal_container">
            <button class="close">&times;</button>
            <div class="heading_slider Modal_heading_slider">
              <div class="blue_dot blue_dot_big modal_blue_dot_big"></div>
              <div class="head_text head_text_big">fees Completed?</div>
            </div>
           <br />
              <div class="upper_box">
                <div class="img_box">
                
                </div>
                <div class="name_box">
                  <p>${Student_name}</p>
                  <p class="fees_text">Paid only ${total_paid_fees}</p>
                </div>
              </div>
  
              <br />


              
            <p class="text">this student Paid only ${total_paid_fees} out of ${Course_fees} do you want to complete it complete</p>
               <br />   <br />
    

            <div class="action">
              <button onclick="confirm_complete_fees('${_id}', ${todo})" id="submit" class="btn_purple main_btn">Do Complete</button></a>
            </div>
            
          </div>
      `;
      document.getElementById("modal_main").appendChild(modal_wrapper);
      modal_js();
    } else {
      confirm_complete_fees(_id, todo);
    }
  } else if (todo == false) {
    console.log(_id)
    confirm_complete_fees(_id, todo);
  }
}

function confirm_complete_fees(_id, todo) {
  console.log(_id);
  socket.emit("complete_fees", _id, todo);
}

socket.on("marked_completed_fees", (students) => {
  console.log(students.fees_completed);
  if (students.fees_completed == true) {
    console.log(students.fees_completed)
    document.getElementById("complete_button").children[1].innerHTML = "Completed";
    if (document.getElementById("modal_main").children[0]) {

    if (document.getElementById("modal_main").children[0].classList.contains("active")) {
      modal_js("close_this");
    }
  }
    document.getElementById(students._id).children[0].children[2].classList.remove("display_none")
    document.getElementById(students._id).children[1].children[3].children[2].classList.add("display_none")
    close_detail_box();
  } else {
    document.getElementById("complete_button").children[1].innerHTML = "Do Completed";
    document.getElementById(students._id).children[0].children[2].classList.add("display_none")
    console.log(document.getElementById(students._id).children[1].children[3].children[2].classList.remove("display_none"))
    // document.getElementById(students._id).children[0].children[3].children[2].classList.remove("display_none")
    close_detail_box();
  }
});











socket.on("take_this_student_data_for_update", (data) => {
  rendering_single_doc(data, "update");
});

let notification_func = () => {
  let detail_container = document.getElementById("detail_container");
  detail_container.innerHTML = "";
  detail_container.classList.remove("detail_container_closed");

  socket.emit("give_updates");
  // create_detail_container(_id)
  window.history.pushState({ page: 2 }, '', window.location.href);
};

let update_array;

socket.on("take_updates", (data) => {
  update_array = data;
  let detail_container = document.getElementById("detail_container");

  detail_container.innerHTML = `
             <nav class="nav_detail_box">
        <!-- ======COMPANY LOGO======= -->
        <div id="Company_logo" class="company_logo">
          <!-- ======MENU ICON BUTTON======= -->
          <div class="menu_icon back_arrow_box" onclick="close_detail_box()">
            <svg
              width="69"
              height="28"
              viewBox="0 0 69 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.23223 17.2322C0.25592 18.2085 0.25592 19.7915 1.23223 20.7678L17.1421 36.6777C18.1184 37.654 19.7014 37.654 20.6777 36.6777C21.654 35.7014 21.654 34.1184 20.6777 33.1421L6.53553 19L20.6777 4.85786C21.654 3.88155 21.654 2.29864 20.6777 1.32233C19.7014 0.34602 18.1184 0.34602 17.1421 1.32233L1.23223 17.2322ZM69 16.5L3 16.5V21.5L69 21.5V16.5Z"
                fill="black"
              />
            </svg>
          </div>

          <!-- ======MENU ICON BUTTON======= -->
          <object
            data="SVG/Company_logo.svg"
            type="image/svg+xml"
            class="logo"
            id="logo"
          ></object>
        </div>

        <!-- ======MENU BUTTON======= -->
        <div id="menu_button_section">
          <!-- ======MENU BUTTON======= -->
        </div>
      </nav>

      <div class="notification_container" id="notification_container">
    


      </div>
  `;
  let date = formatDate(new Date(data[0].time));
  data.forEach((element) => {
    let notification_container = document.getElementById(
      "notification_container"
    );
    // console.log(formatDate(new Date(element.time)))
    if (formatDate(new Date(element.time)) != date) {
      console.log(date);

      let heading_slider = document.createElement("div");
      heading_slider.className = "heading_slider";
      heading_slider.innerHTML = `<div class="blue_dot"></div>
          <div class="head_text">${date}</div>`;
      notification_container.prepend(heading_slider);

      date = formatDate(new Date(element.time));
    }

    let notification_box = document.createElement("div");
    notification_box.className = "notification_box";

    if (element.type_update == "fees Added") {
      notification_box.id = element._id;
      notification_box.innerHTML = `
    <div class="notice_head">
      <div class="grey_box"></div>
      <div class="notification_head">${element.done_by_name}</div>
    </div>
    <h4 class="notification_domain">fees Added</h4>
    <div  onclick="Student_detail_function('${element.student_id}')" class="upper_box noti_upper_box">
      <div class="img_box">
        <img src="/uploads/student_photos/${element.profile_img}" alt="">
      </div>
      <div class="name_box">
        <p>${element.student_name}</p>
      </div>
    </div>

    <div class="bottom_box_notice">
      <div class="data_box" onclick="addrecipt_No('${element.student_id}' , '${
        element.instalment_id
      }' , '${element._id}' , '${element.recipt_No}')">
        <p class="head_data">payment Date</p>
        <div class="main_data_box">
          <div class="date_box">${formatDate(new Date(element.time))}</div>
          <div class="date_box recipt_no">R- ${element.recipt_No}</div>
          <div class="Amount">${element.fees_amount} INR</div>
        </div>
      </div>
    </div>
    
    `;
    } else if (element.type_update == "admission") {
      notification_box.innerHTML = `<div class="notice_head">
      <div class="grey_box"></div>
      <div class="notification_head">${element.done_by_name}</div>
    </div>
    <h4 class="notification_domain">Admission</h4>
    <div class="upper_box noti_upper_box">
      <div class="img_box">
       <img src="/uploads/student_photos/${element.profile_img}" alt="">
      </div>
      <div class="name_box">
        <p>${element.student_name}</p>
      </div>
    </div>


    
    `;
    }

    notification_container.prepend(notification_box);
  });

  let heading_slider = document.createElement("div");
  heading_slider.className = "heading_slider";
  heading_slider.innerHTML = `<div class="blue_dot"></div>
      <div class="head_text">${date}</div>`;
  notification_container.prepend(heading_slider);
});









function addrecipt_No(student_id, instalment_id, update_id, recipt_No) {
  console.log(student_id, instalment_id, update_id, recipt_No);

  // let id = element.parentElement.parentElement.parentElement.id;
  let update_obj;
  update_array.forEach((element) => {
    if (element._id == update_id) {
      update_obj = element;
    }
  });

  if (recipt_No !== "undefined") {
    let modal_wrapper = document.createElement("div");
    modal_wrapper.className = "modal_wrapper";
    modal_wrapper.innerHTML = `
            <div class="modal_container">
            <button class="close">&times;</button>
            <div class="heading_slider Modal_heading_slider">
              <div class="blue_dot blue_dot_big modal_blue_dot_big"></div>
              <div class="head_text head_text_big">Change Code?</div>
            </div>
           <br />
              <div class="upper_box">
                <div class="img_box"></div>
                <div class="name_box">
                  <p>${update_obj.student_name}</p>
                  <p class="fees_text"></p>
                </div>
              </div>
  
              <br />


              
            <p class="text">want to change the recipt number of ${update_obj.student_name} then click on the 'Change Code' Button</p>
               <br />   <br />
    

            <div class="action">
              <button onclick="recipt_form_creator( '${student_id}', '${instalment_id}', '${update_id}', '${update_obj.student_name}', '${update_obj.fees_amount}');" id="submit" class="btn_purple main_btn">Change Code</button></a>
            </div>
            
          </div>
      `;
    document.getElementById("modal_main").appendChild(modal_wrapper);
  } else {
    recipt_form_creator( student_id, instalment_id, update_id, update_obj.student_name, update_obj.fees_amount);
  }

  // socket.emit("give_amount_presets")
  modal_js();
}

function recipt_form_creator( student_id, instalment_id, update_id, student_name, fees_amount) {
  console.log(student_id, instalment_id, update_id, student_name, fees_amount);
  let modal_wrapper = document.createElement("div");
  modal_wrapper.classList = "modal_wrapper no";
  modal_wrapper.innerHTML = `
        <div class="modal_container">
        <button class="close">&times;</button>
        <div class="heading_slider Modal_heading_slider">
          <div class="blue_dot blue_dot_big modal_blue_dot_big"></div>
          <div class="head_text head_text_big">Add Recipt Number</div>
        </div>
        <!-- <p class="text">If you already Rk coaching student then create your account click on Sign Up</p>
          <div class="action">
          <a href="/signIn" ><button class="btn_purple">Sign Up</button></a>
              <a href="/HTML/login.html" ><button class="btn_purple">Login</button></a>
          </div> -->
        <form onsubmit="Add_Recipt_number(event , '${student_id}' , '${instalment_id}' , '${update_id}' )" id="form_signIn">
          <div>
            <br />
            <p class="_inp_disclamer">
              Please insure the name of the student is correct and enter correct Recipt Number
            </p>
            <br />
            <br />
          </div>

          <div class="upper_box">
            <div class="img_box"></div>
            <div class="name_box">
              <p>${student_name}</p>
              <p class="fees_text">payment =  ${fees_amount} INR</p>
            </div>
          </div>

          <br />
          <br />
          <!-- user mobile number -->
          <p  class="label_inp">Recipt Number</p>
          <input
            type="text"
            name="Recipt_No"

            id="Special_inp"
            placeholder="Enter Number"
            required
          />  


          <br />
          <br />
          <br />
          <br />


          <div class="btn_s" class="main_btn">
            <input
              type="submit"
              id="submit"
              class="main_btn"
              value="Add Recipt Number  "
            />
          </div>
        </form>
      </div>
  `;
  // console.log(document.getElementById("modal_main").children[0].remove())
  document.getElementById("modal_main").innerHTML = "";
  document.getElementById("modal_main").appendChild(modal_wrapper);
  modal_js();
}

async function Add_Recipt_number(event, student_id, instalment_id, update_id) {
  // first form submited # user_nsme & mobile number is sended

  event.preventDefault();

  let recipt_No = document.getElementById("Special_inp").value;

  if (recipt_No < 0) {
    return;
  }
  console.log()
  if (recipt_No.toString().length >= 5) {
    alert("recipt Number cannot more then '4' digit")
    return;
  }

  console.log(recipt_No);

  document.getElementById("submit").disabled = true;

  let objectToSend = {
    recipt_No: recipt_No,
    student_id,
    instalment_id,
    update_id,
  };

  console.log(objectToSend);
  await socket.emit("Add_recipt_number", objectToSend);
}

socket.on("recipt_number_updated", (update_obj2) => {
  console.log(update_obj2);

  let notification_box = document.createElement("div");
  notification_box.classList = "notification_box";

  notification_box.id = update_obj2._id;
  notification_box.innerHTML = `
    <div class="notice_head">
      <div class="grey_box"></div>
      <div class="notification_head">${update_obj2.done_by_name}</div>
    </div>
    <h4 class="notification_domain">fees Added</h4>
    <div  onclick="Student_detail_function('${
      update_obj2.student_id
    }')" class="upper_box">
      <div class="img_box">
        <img src="/uploads/student_photos/${update_obj2.profile_img}" alt="">
      </div>
      <div class="name_box">
        <p>${update_obj2.student_name}</p>
      </div>
    </div>

    <div class="bottom_box_notice">
      <div class="data_box" onclick="addrecipt_No('${
        update_obj2.student_id
      }' , '${update_obj2.instalment_id}' , '${update_obj2._id}' , '${
    update_obj2.recipt_No
  }')">
        <p class="head_data">payment Date</p>
        <div class="main_data_box">
          <div class="date_box">${formatDate(new Date(update_obj2.time))}</div>
          <div class="scale_it date_box recipt_no">R- ${
            update_obj2.recipt_No
          }</div>
          <div class="Amount">${update_obj2.fees_amount} INR</div>
        </div>
      </div>
    </div>`;

  modal_js("close_this");

  document
    .getElementById(update_obj2._id)
    .children[3].children[0].children[1].children[1].classList.add("scale_it");
  setTimeout(() => {
    document.getElementById(update_obj2._id).replaceWith(notification_box);
  }, 300);
  setTimeout(() => {
    document
      .getElementById(update_obj2._id)
      .children[3].children[0].children[1].children[1].classList.remove(
        "scale_it"
      );
    document
      .getElementById(update_obj2._id)
      .children[3].children[0].children[1].children[1].classList.add(
        "scale_remove"
      );
  }, 600);
  setTimeout(() => {
    document
      .getElementById(update_obj2._id)
      .children[3].children[0].children[1].children[1].classList.remove(
        "scale_remove"
      );
  }, 700);

  document.getElementById(
    update_obj2.student_id
  ).children[1].children[1].children[1].children[1].textContent =
    "R- " + update_obj2.recipt_No;
});







// search filter
let Batch_heading = document.getElementById("Batch_heading");

function search_student(element) {
  let value = element.value;
  if (value == "") {
    if (Batch_code) {
      socket.emit("give_students", "id", Batch_code);
    }
    if (Batch_name == undefined) {
      Batch_heading.textContent = "select any batch";
    } else {
      Batch_heading.textContent = Batch_name;
    }
    return;
  }
  socket.emit("search_student", value);

  Batch_heading.textContent = "Search";
}





function filter_student(event) {
  event.preventDefault();

  let Filter_amount = document.getElementById("Filter_amount").value;
  if (Filter_amount == 0 || Filter_amount < 0) {
    return;
  }
  let type = event.target.elements.filter_type.value;

  socket.emit("filter_student", Filter_amount, type, Batch_code);
  event.target.reset();
}

function clear_filter() {
  socket.emit("give_students", "id", Batch_code);
}




function add_expexted_date(element , _id , student_name) {
  console.log(element, _id);
  let modal_wrapper = document.createElement("div");
  modal_wrapper.classList = "modal_wrapper";
  modal_wrapper.innerHTML = `
        <div class="modal_container">
        <button class="close">&times;</button>
        <div class="heading_slider Modal_heading_slider">
          <div class="blue_dot blue_dot_big modal_blue_dot_big"></div>
          <div class="head_text head_text_big">set NED</div>
        </div>
        <!-- <p class="text">If you already Rk coaching student then create your account click on Sign Up</p>
          <div class="action">
          <a href="/signIn" ><button class="btn_purple">Sign Up</button></a>
              <a href="/HTML/login.html" ><button class="btn_purple">Login</button></a>
          </div> -->
        <form onsubmit="take_date_of_NED(event , '${_id}')" id="form_signIn">
          <div>
            <br />
            <p class="_inp_disclamer">
              Please insure the name of the student is correct and enter correct Recipt Number
            </p>
            <br />
            <br />
          </div>

          <div class="upper_box">
            <div class="img_box"></div>
            <div class="name_box">
              <p>${student_name}</p>
            </div>
          </div>

          <br />
          <br />
          <!-- user mobile number -->
          <p  class="label_inp">Amount</p>
          <input
            type="text"
            name="Payment_ammout"
            id="Special_inp"
            placeholder="Enter Number"
          />  
          <p  class="label_inp">enter_date</p>
          <input
            type="number"
            name="date"
            id="date_inp"
            placeholder="Enter Number"
            required
          />  

            <label class="type_selector" for="this_month">
              <input
                type="radio"
                name="date_"
                class="filter_type"
                id="this_month"
                value="this_month"
                required
              />
              this month
            </label>
            <label class="type_selector" for="next_month">
              <input
                type="radio"
                name="date_"
                class="filter_type"
                id="next_month"
                value="next_month"
                required
              />
              next month
            </label>


          <br />
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
              value="Add Recipt Number "
            />
          </div>
        </form>
      </div>
  `;
  // console.log(document.getElementById("modal_main").children[0].remove())
  document.getElementById("modal_main").innerHTML = "";
  document.getElementById("modal_main").appendChild(modal_wrapper);
  socket.emit("give_amount_presets")
  modal_js();
}


function take_date_of_NED(event , _id) {
  event.preventDefault();

  let date = document.getElementById("date_inp").value;
  const fee_Amount = document.getElementById("Special_inp").value;
  if (fee_Amount < 0 || fee_Amount >12000) {
    event.target.reset();
    alert("fees Amount cannot be negative or more then 12000")
    return
  }

  if (date < 0) {
    event.target.reset();
    alert("date cannot be negative")
    return
  }else if (date > 31) {
    event.target.reset();
    alert("date cannot be more than 31")
    return
  }

  let type = event.target.elements.date_.value;
  const new_date = getSpecificDate(parseInt(date), type);


  function getSpecificDate(day, monthSpecifier) {
    if (typeof day !== 'number' || day < 1 || day > 31) {
        // throw new Error("Invalid day. Please provide a valid day number between 1 and 31.");
        alert("date is not valid")
        return
    }
  
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
  
    if (monthSpecifier === "next_month") {
        month += 1;
        if (month > 11) {
            month = 0;
            year += 1;
        }
    } else if (monthSpecifier !== "this_month") {
        throw new Error("Invalid monthSpecifier. Use 'this month' or 'next month'.");
    }
  
    // Check if the provided day is valid for the calculated month and year
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    if (day > lastDayOfMonth) {
        throw alert(`Invalid day. The month ${month + 1} of year ${year} has only ${lastDayOfMonth} days.`);
    }
  
    // Create a new date for the specified day, month, and year
    const specificDate = new Date(Date.UTC(year, month, day));
    return specificDate //.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }
  
  socket.emit("set_Next_expected_date" , new_date , fee_Amount , _id)



}

socket.on("seted_Next_expected_date" ,student=>{
  modal_js("close_this")
  rendering_single_doc(student, "update");
})


function remove_this_fees(_id , student_id) {
  console.log(_id , student_id)
  let reason
  if (confirm("do you want to remove the this 'Instalment'")) {
    reason = prompt("any reason why are you removing this instalment ")
  } else {
    return
  }
  socket.emit("remove_this_installment" , _id , student_id ,reason)
}

function remove_remove_this_fees(_id , student_id) {
  console.log(_id , student_id)
  // let reason
  if (confirm("do you want to add this 'Instalment' again ")) {
    socket.emit("remove_remove_this_installment" , _id , student_id )
  } else {
    return
  }
}

