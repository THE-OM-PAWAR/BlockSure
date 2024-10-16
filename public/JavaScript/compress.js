let input = document.getElementById('your_photo');
let username = document.getElementById('username');
let preview = document.getElementById("preview")
preview.style.display = "none"
WIDTH = 600

input.addEventListener("change", (event) => {
    let image_file = event.target.files[0];
    console.log(username.value)
    
    console.log("Original File", image_file)
    if (image_file == undefined) {
        preview.firstElementChild.src = "../uploads/result_folder/user.svg"
        return
    }
    let reader = new FileReader();
    
    reader.readAsDataURL(image_file);
    reader.onload = (event) => {
        console.log(event.target)
        image_url = event.target.result;
        let image = document.createElement('img');
        image.src = image_url;
        
        image.onload = (e) => {
            
            let canvas = document.createElement('canvas');
            let ratio = WIDTH / image.width;
            canvas.width = WIDTH;
            canvas.height = image.height * ratio;
            
            let context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            
            let new_image_url = canvas.toDataURL('image/jpeg', 98)
            
            // console.log("Image URL: ", new_image_url)
            
            let image_file = urlToFile(new_image_url)
            // uploadImage(image_file)
            console.log(image_file)
            input.files[0] = image_file;
            let img = document.createElement("img")
            img.src= new_image_url
            preview.innerHTML= ""
            preview.style.display = "inherit"
            preview.appendChild(img)
            
            
            let dt = new DataTransfer()
            dt.items.add(image_file)
            console.log(dt.files)
            console.log(input.files = dt.files)
            
            
        } 

    }
})

let urlToFile = (url) => {
    
    let arr = url.split(",")
    // console.log(arr)
    let mime = arr[0].match(/:(.*?);/)[1]
    let data = arr[1]
    
    let dataStr = atob(data)
    let n = dataStr.length
    let dataArr = new Uint8Array(n)
    
    while(n--)
    {
        dataArr[n] = dataStr.charCodeAt(n)
    }

    let file  = new File([dataArr], `${username.value + Math.floor(Math.random() * 100000)}.jpg`, {type: mime})
    console.log(file.name)

    return file



}

// createed by OM 