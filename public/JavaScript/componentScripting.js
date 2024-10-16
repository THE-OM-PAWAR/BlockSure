// =============== declearing all element =====================//

const slider_box = document.getElementById("slider_box");
const all_batch_list = document.getElementById("all_batch_list");
const pre_Toppers_wrapper = document.getElementById("pre_Toppers_wrapper");
const main_img_box = document.getElementById("main_img_box");
// functions of image slider for moving slide of slider

// logic
document.getElementById("left_move").onclick = () => {
  slider_box.scrollLeft -= document.body.offsetWidth;
};
document.getElementById("right_move").onclick = () => {
  slider_box.scrollLeft += document.body.offsetWidth;
};

const card_main = Array.from(document.getElementsByClassName("card_main"));
let card_width;
card_main.forEach((element) => {
  card_width = element.offsetWidth;
});
document.getElementById("left_move_card").onclick = () => {
  pre_Toppers_wrapper.scrollLeft -= card_width;
};
document.getElementById("right_move_card").onclick = () => {
  pre_Toppers_wrapper.scrollLeft += card_width;
};









const image = Array.from(document.getElementsByClassName("image"));
let img_width;
image.forEach((element) => {
  img_width = element.offsetWidth;
  console.log(img_width);
});
document.getElementById("left_OF_move").onclick = () => {
  main_img_box.scrollLeft -= img_width;
};
document.getElementById("right_OF_move").onclick = () => {
  main_img_box.scrollLeft += img_width;
};











// functions of benifits slider for changing slide of slider automatically

let benifitCount = 0;
setInterval(() => {
  console.log(image.length);
  if (benifitCount === image.length) {
    main_img_box.scrollLeft -= benifitCount * img_width;
    benifitCount = 1;
    return;
  }
  main_img_box.scrollLeft += img_width;
  benifitCount++;
}, 8000);










// functions of image slider for changing slide of slider automatically

let slideCount = Array.from(document.getElementsByClassName("slide"));
let usedCount = 0;
setInterval(() => {
  if (usedCount === slideCount.length) {
    slider_box.scrollLeft -= usedCount * document.body.offsetWidth;
    usedCount = 1;
    return;
  }
  slider_box.scrollLeft += document.body.offsetWidth;
  usedCount++;
}, 4000);













// functions of image slider for changing slide of slider automatically
let batch = document.getElementsByClassName("batch");
let batch_arr = Array.from(batch);
let length;
batch_arr.forEach((element) => {
  length = element.offsetWidth;
});
let usedCounts = 0;
setInterval(() => {
  if (usedCounts === batch_arr.length) {
    all_batch_list.scrollLeft -= usedCounts * length;
    usedCounts = 1;
    return;
  }
  all_batch_list.scrollLeft += length;
  usedCounts++;
}, 10000);

// function for menu button functionality



const open_features = (element) => {
  if (document.body.offsetWidth > 600) {
    return;
  }
  element.setAttribute("onclick", "close_features(this)");
  element.classList.remove("features");
  element.classList.add("features_opened");
};

const close_features = (element) => {
  element.setAttribute("onclick", "open_features(this)");
  element.classList.add("features");
  element.classList.remove("features_opened");
};



// ------------ IntersectionObserver for following lazy loading------------//

let other_benefits_array = [
  {
    img_src: "uploads/coaching2.jpg",
    heading: "Competitive Environment",
    textContent:
      "Experience a dynamic, competitive environment that pushes students to excel and achieve their highest potential.",
  },
  {
    img_src: "uploads/coaching1.jpg",
    heading: "Engaging Learning",
    textContent:
      "Enjoy an engaging and lively learning experience with a teacher who brings fun and enthusiasm to the classroom.",
  }
];

const iso2 = new IntersectionObserver(
  (entries) => {
    // console.log("ompawar");
    entries.forEach((item) => {
      console.log(item.isIntersecting)
      if (item.isIntersecting) {
        let src = item.target.children[0].src.slice(22);
        other_benefits_array.forEach((element) => {
          let src2 = element.img_src.replace("_", "%20");
          let src3 = src2.replace(" ", "%20");
        console.log(src , src3)
          if ("n/"+src3 == src) {
            console.log("equal")
            let info_OF = document.getElementById("info_OF");
            info_OF.children[0].textContent = element.heading;
            info_OF.children[1].textContent = element.textContent;
          }
        });
      }
    });
  },
  {
    threshold: 0.5,
  }
);

document.querySelectorAll(".image").forEach((element) => {
  iso2.observe(element);
});
const email_box = document.getElementById("email_box");
const E_mail_real = document.getElementById("E_mail_real");


// ====== other benefit styling




E_mail_real.onclick = function () {
  document.execCommand("copy");
};

E_mail_real.addEventListener("copy", function (event) {
  event.preventDefault();
  console.log(event.clipboardData);
  if (event.clipboardData) {
    event.clipboardData.setData("text/plain", E_mail_real.textContent);
    alert("e-mail is copyed is copyed");
    console.log(event.clipboardData.getData("text"));
  }
});




// onclick copying system
const mobile_no = document.getElementById("mobile_no");
const mobile_no_pre = document.getElementById("mobile_no_pre");

mobile_no_pre.onclick = function () {
document.execCommand("copy");
};



mobile_no_pre.addEventListener("copy", function (event) {
event.preventDefault();
console.log(event + "ok");
if (event.clipboardData) {
  event.clipboardData.setData("text/plain", mobile_no.textContent);
  alert("mobile number is copyed");
}
});
