// ------------ IntersectionObserver for following lazy loading------------//
let length = 0
let count2 = 0;
const iso = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }
    count2++;
    console.log(length)
    socket.emit("draft_result", count2 , length);
  });
}, {});

// iso.observe(document.getElementById("watch_end_of_document"));
iso.observe(document.getElementById("watch_end_of_document2"));

socket.on("take_draft_result", (draft_result) => {
  length+=draft_result.length
  console.log(length)
  let data_array = draft_result;
  console.log(data_array);
  data_array.forEach((element) => {

    const student_box = document.getElementById("student_box");
    let main_student_box = document.createElement("div");
    main_student_box.className = "main_student_box"
    main_student_box.innerHTML = `
          <div class="img_division" onclick="makebig(this)">
                  <img src="../uploads/result_folder/${
                    element.result_photo
                  }" alt="@img" />
                </div>
                <div class="up_division">
                  <div class="img_box">
                    <img src="../uploads/result_folder/${
                      element.your_photo
                    }" alt="@img" />
                  </div>
                  <div class="info_student">
                    <div class="student_name"><p>${
                      element.student_name
                    }</p></div>
                    <div class="student_year"><p>20${element.session}</p></div>
                  </div>
                </div>
                <div class="low_division">
                  <div class="info_percent">
                    <div class="student_percen"><p>persentage :${
                      element.Total_mark / 5
                    }</p></div>
                    <div class="student_percen"><p>mark :${
                      element.Total_mark
                    }</p></div>
                    <div class="student_percen"><p>class : ${
                      element.class_
                    }</p></div>
                  </div>
                </div>
                <div class="Approve_btn_box">
                <button id="${element._id}" onclick="reject_this(this)">Reject</button>
                  <button  onclick="approve_this(this)" >Approve</button>
                </div>
                <div ></div>
                `;
    student_box.appendChild(main_student_box);
  });
});

let reject_this = async (element) => {

  element.disabled=true
  element.parentElement.children[1].disabled=true;
  let _id = element.id;
  socket.emit("remove-from-draft", _id);
};

socket.on("ok-deleted-result", async (_id) => {
  let button = document.getElementById(_id);
  button.parentElement.children[1].remove();
  button.textContent = "rejected";
  button.removeAttribute("onclick")
  button.parentElement.parentElement.children[0].remove()
  button.parentElement.parentElement.style.position = "relative"
  button.parentElement.parentElement.lastElementChild.classList.add("disabled_box")
});



let approve_this = (element)=>{
  element.disabled=true
  element.parentElement.children[0].disabled=true;
  let _id = element.parentElement.children[0].id
  console.log(_id)
  socket.emit("approve-this-result", _id);
}



socket.on("approvation-confirm", async (_id) => {
  console.log(_id)
  let button = document.getElementById(_id);
  button.parentElement.children[1].textContent = "Approved";
  button.removeAttribute("onclick")
  button.parentElement.parentElement.children[0].remove()
  button.parentElement.parentElement.style.position = "relative"
  button.parentElement.parentElement.lastElementChild.classList.add("disabled_box")
  button.parentElement.children[0].remove();
});
