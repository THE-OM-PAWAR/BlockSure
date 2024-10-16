//   // result serving system is here

socket.emit("give-result-slider");
socket.on("take-result-slider", async (result_array) => {
  let pre_Toppers_wrapper = document.getElementById("pre_Toppers_wrapper");
  pre_Toppers_wrapper.innerHTML = ""
  result_array.forEach((element) => {
    let card_main = document.createElement("div");
    card_main.className = "card_main";
    card_main.innerHTML = `
        <div class="card_img">
                <img src="uploads/result_folder/${element.your_photo}"  loading="lazy" alt="" />
              </div>
              <div class="card_info">
                <h5>${element.student_name}</h5>
                <p>
                ${element.rank} <span class="session_text">20${
      element.session
    }</span>
                </p>
                <div class="acadmics_info">
                  <div class="class_box">
                    <p class="identifier">Class</p>
                    <p class="class_">${element.class_}</p>
                  </div>
                  <div class="percentage_box">
                    <p class="identifier">percentage</p>
                    <p class="percentage_">${element.Total_mark / 5}%</p>
                  </div>
                </div>
              </div>
        `;
    pre_Toppers_wrapper.append(card_main);
    
    
});
let atag = document.createElement("a")
atag.href = "HTML/topper.html"
atag.innerHTML = `     <div class="card_main see_more">
<div>See All &gt;&gt;</div>
</div>`
pre_Toppers_wrapper.append(atag);
});
