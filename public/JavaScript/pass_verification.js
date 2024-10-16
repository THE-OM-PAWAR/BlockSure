 //                 PASSWARD VERIFICATION                   //
//------- Cmpairing "passward" & "confirm_passward" -------//


function checkPass() {
    let instruction = document.getElementById("instruction");
    document.getElementById("form_signIn");
    console.log();
  
    if (password.value == C_password.value) {
      if (instruction.classList.contains("incorrect")) {
        instruction.classList.replace("incorrect", "correct");
      } else {
        instruction.classList.add("correct");
      }
      instruction.textContent = "Passward is correct";
      form_signIn.setAttribute("onsubmit", "return true");
      console.log("correct");
    } else {
      if (instruction.classList.contains("correct")) {
        instruction.classList.replace("correct", "incorrect");
      } else {
        instruction.classList.add("incorrect");
      }
      let form_signIn = document.getElementById("form_signIn");
      form_signIn.setAttribute("onsubmit", "event.preventDefault()");
      console.log("incorrect" + password.value + "," + C_password.value);
      instruction.textContent = "Passward not matching";
    }
  }

  const Total_mark = document.getElementById("Total_mark")
  Total_mark.onchange = ()=>{
    let mark = Total_mark.value
    const percentage = document.getElementById("percentage")

    percentage.value = mark/5

  }