// function for menu button functionality 
const menu_box =document.getElementById("menu_box")
const menu_icon = document.getElementById("menu_icon")
const close_btn = document.getElementById("close_btn")
menu_icon.addEventListener( "click" , function(){
    menu_box.classList.remove("display_none")
    menu_box.style.display = "flex"
    setTimeout(() => {
        menu_box.classList.add("menu_box_ON")
    }, 10);
    document.body.style.overflow = "hidden";
})
close_btn.addEventListener( "click" , function(){
    menu_box.classList.remove("menu_box_ON")
    setTimeout(() => {
        menu_box.classList.add("display_none")
        menu_box.style.display = "none"
    }, 300);
    document.body.style.overflow = "scroll";
})
function close_btn_func(){
    menu_box.classList.add("display_none")
    menu_box.classList.remove("menu_box_ON")
    document.body.style.overflow = "scroll";
}

let count = 0; 
const makebig = (element) => {
    count++
    element.classList.toggle("makebig");
    element.classList.toggle("img_division");
    if (element.classList.contains("makebig")) {
        document.body.style.overflow = "hidden"
    }else if (element.classList.contains("img_division")) {
        count = 0
        document.body.style.overflow = "scroll"
    }
};
