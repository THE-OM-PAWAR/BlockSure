let socket = io();
let info;
socket.emit("confirm");

//   PERSONAL DATA FETCHING            //
// =========== calling API for user data ===========//

const user_data = async () => {
  console.log("data")
  const response = await fetch("/m_data");
  let data = await response.json();
  console.log(data + 1234)
  if (data.position === "modal5") {
    const modal_html = data.body.modal_html;
    info = "remain";
    socket.emit("menu-please", info);
    setTimeout(async () => {
      const modal_main = await document.getElementById("modal_main");
      modal_main.innerHTML = await modal_html;
      //  await modal_js();
    } ,1000*60);
    setTimeout(() => {
      // modal_js("close_this");
    }, 70000);
    return data;
  } else if (data.position == "user") {
    info = "loged_in";
    Array.from(document.getElementsByClassName("option_name")).forEach(
      (element) => {
        if (element.textContent === "Log In") {
          element.parentElement.parentElement.remove();
          console.log("ok");
        }
      }
    );
    socket.emit("menu-please", info);
  } else if (data.position == "supervisor") {
    info = "supervisor";

    Array.from(document.getElementsByClassName("option_name")).forEach(
      (element) => {
        if (element.textContent === "Log In") {
          console.log(element)
          element.parentElement.parentElement.remove();
          console.log("ok");
        }
      }
    );
    socket.emit("menu-please", info);
  }

  if (data.rejected_request) {
    let index = 0;
    let element = data.rejected_request;
    const modal_main = document.getElementById("modal_main");
    modal_main.innerHTML = `
            <div class="modal_wrapper">
            <div class="modal_container">
            <button class="close">&times;</button>
            <h2 class="modal_h2" >Request Rejected</h2>
            <p class="text">your request of submiting your result is result of class ${element.class_} and session 20${element.session} is rejected because of improper content .\n please fill the form again properly</p>
            <div class="action">
            <a href="HTML/result_form.html" ><button class="btn_purple">Submit Again</button></a>
            </div>
            </div>
            </div>`;
    modal_js();
    index++;
    console.log(index);

    console.log(element._id);
    socket.emit("showed_rejected", element._id);
  }
};
user_data();
