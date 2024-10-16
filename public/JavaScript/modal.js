// const trigger = document.querySelector("#trigger");
const modalWrapper = document.querySelector(".modal_wrapper");
function modal_js(close_this) {
  // const trigger = document.querySelector(".trigger");
  const modalWrapper = document.querySelector(".modal_wrapper");
  const closeBtn = document.querySelector(".close");
  document.body.style.overflow = "hidden";
  // if (trigger) {
    // trigger.addEventListener("click", function () {
      // modalWrapper.classList.add("active");
    // });
  // } else {
    // modalWrapper.classList.add("active");
  // }
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
       document.getElementById("modal_main").innerHTML = ""
      modalWrapper.classList.remove("active");
      document.body.style.overflow = "scroll";
    });
  }
  modalWrapper.addEventListener("click", function (e) {
    if (e.target.classList.contains("no")) return;
    if (e.target !== this) return;
     document.getElementById("modal_main").innerHTML = ""
    modalWrapper.classList.remove("active");
    document.body.style.overflow = "scroll";
  });
  if (close_this == "close_this") {
    document.getElementById("modal_main").innerHTML = ""
    modalWrapper.classList.remove("active");
    document.body.style.overflow = "scroll";
    
  }else{
      modalWrapper.classList.add("active");
  }
}

