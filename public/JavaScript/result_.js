let value 
let length = 0;
let length_specific = 0;
let count2 = 0;
let count_specific = 0;
let push =0

const iso = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }
    count2++;
    socket.emit("give-result-page", count2, length);

    document.getElementById("Loading_indicator").style.display = "flex"
  });
}, {});
const iso2 = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }
    count_specific++;
    socket.emit("give-result-specific" ,count_specific, length_specific, value)
    document.getElementById("Loading_indicator").style.display = "flex"
  });
}, {});
iso.observe(document.getElementById("watch_end_of_document2"));
iso2.observe(document.getElementById("watch_end_of_document1"));


let push2 = 0

socket.on("take-result-page", async (result_array) => {

  length += result_array.length;

  if (window.innerWidth > window.innerHeight && push2 === 0 ) {
    count2++;
    push2++
    socket.emit("give-result-page", count2, length);
  }


  document.getElementById("Loading_indicator").style.display = "none"
  let student_box = document.getElementById("student_box");
  //   student_box.innerHTML=""
  let observer_element2 =  document.getElementById("watch_end_of_document2")
  observer_element2.style.display = "initial"
  
  result_array.forEach((element) => {
    console.log(1111)
    let main_student_box = document.createElement("div");
    main_student_box.className = "main_student_box";
    main_student_box.innerHTML = `
    <div class="img_box">
      <img src="../uploads/result_folder/${element.your_photo}" alt="@img">
      </div>
      <div class="info_student">
      <div class="student_name"><p>${element.student_name}</p></div>
      <div class="student_year"><p>${element.rank + " "}20${element.session +"    class"+ element.class_ }</p></div>
      </div>
      <div class="info_percent">
      <div class="student_percent"><p>${element.Total_mark / 5}%</p></div>
      </div>
      `;
      student_box.append(main_student_box);
    });
  });
  
  let class_selection = document.getElementById("class_selection");
  
  let class_selection_func = async (element) => {
    push = 0;
    push2 = 0;
    let observer_element2 =  document.getElementById("watch_end_of_document2")
    observer_element2.style.display = "none"
    let observer_element1 =  document.getElementById("watch_end_of_document1")
    observer_element1.style.display = "none"
    
    
    value = element.value;
  count_specific =0 
  length_specific =0
  
  count2 = 0
  length= 0
  let student_box = document.getElementById("student_box");
  student_box.innerHTML=""
  const heading_class = document.getElementById("heading_class");
  if (parseInt(value) === 10) {
    heading_class.children[0].textContent = "Class 10th";

    document.getElementById("Loading_indicator").style.display = "flex"
  } else if (parseInt(value) === 11) {
    heading_class.children[0].textContent = "Class 11th";

    document.getElementById("Loading_indicator").style.display = "flex"
  } else if (parseInt(value) === 12) {
    heading_class.children[0].textContent = "Class 12th";

    document.getElementById("Loading_indicator").style.display = "flex"
  } else {
    heading_class.children[0].textContent = "Result";
    socket.emit("give-result-page" , count2 ,length)
    document.getElementById("Loading_indicator").style.display = "flex"
    observer_element2.style.display = "none"
    observer_element1.style.display = "none"
  }

      socket.emit("give-result-specific" ,count_specific, length_specific, value)
};


let thenn = (e)=>{
  console.log(e)
}


socket.on("take-result-specific" ,async (result_array )=>{

  length_specific += result_array.length;
  if (window.innerWidth > window.innerHeight && push === 0) {
    count_specific++
    push++
    console.log("ok")
    socket.emit("give-result-specific" ,count_specific, length_specific, value)
  }

  let student_box = document.getElementById("student_box");
  
  document.getElementById("Loading_indicator").style.display = "none"
  
  result_array.forEach((element) => {
    // console.log("o")
    let main_student_box = document.createElement("div");
    main_student_box.className = "main_student_box";
    main_student_box.innerHTML = `
    <div class="img_box">
    <img src="../uploads/result_folder/${element.your_photo}" alt="@img">
    </div>
    <div class="info_student">
    <div class="student_name"><p>${element.student_name}</p></div>
    <div class="student_year"><p>${element.rank + " "}20${element.session +"    class"+ element.class_ }</p></div>
    </div>
    <div class="info_percent">
    <div class="student_percent"><p>${element.Total_mark / 5}%</p></div>
  </div>
          `;
      student_box.append(main_student_box);
    });


    let observer_element2 =  document.getElementById("watch_end_of_document2")
    let observer_element1 =  document.getElementById("watch_end_of_document1")
    observer_element2.style.display = "none"
    observer_element1.style.display = "initial"
})










