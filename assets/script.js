var call_form_ = document.querySelector("#formContainer form");
var call_formData = new FormData(call_form_);
var call_params = "";
var rate = document.querySelector(".smileRating");
var progressNum = "%";
var rateOptions = document.querySelectorAll(".smileRating img");
var preloader = document.querySelector('.preloder');
rateOptions.forEach((rate) => {
  rate.addEventListener("click", () => {
    rateOptions.forEach(
      (rate) => (rate.src = `./assets/imgs/${rate.name}.svg`)
    );
    rate.src = `./assets/imgs/${rate.name}Selected.svg`;
    document.getElementById("moodRate").value = rate.name;
    console.log(document.getElementById("moodRate").value, " = ", rate.name);
  });
});

let call_trigger = async (url, data) => {
  const response = await fetch(url, {
    method: "POST",
    cache: "no-cache",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: data, // body data type must match "Content-Type" header
  });

  return response; // parses JSON response into native JavaScript objects
};

call_form_.addEventListener("submit", (e) => {
  e.preventDefault();

  document.querySelectorAll("input[type=checkbox]").forEach((checkBox) => {
    console.log(checkBox, checkBox.value, checkBox.name);
    checkBox.checked ? call_formData.append(`${checkBox.name}`, `${checkBox.value}`) : call_formData.append(`${checkBox.name}`, `Not done`);
  });

  for (var [key, value] of call_formData.entries()) {
    console.log("key :", key, key === "progress");
    call_params += `${key}=${
      key === "progress"
        ? progressNum
        : document.querySelector("*[name=" + key + "]").value //  finds first radius and always sends 20%
    }&`;
    console.log(key, value);
  }

  // dataObject = Object.fromEntries(fn)
  console.log("this is the data retreived", call_params);
  call_trigger(
    "https://hooks.airtable.com/workflows/v1/genericWebhook/appELJwYYus7qLt4Q/wflAs9AHZzei3EO7D/wtrC6Af88tnEk0Sb7",
    call_params
  ).then((data) => {
    console.log(data);
    call_form_.reset();
    window.alert("Your Daily Report Has Been Sent! thank you!");
    // window.location.reload()
  });
});

document.querySelectorAll("input[type=radio]").forEach((radioBtn) => {
  radioBtn.addEventListener("click",({target})=>{
    call_formData.set(`${target.name}`, `${target.value}`)
    progressNum = call_formData.get(`${target.name}`)
  })
});

const uploadFiles = async (fileInput, type, validation) => {
  preloader.style.display = 'block'

  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  formData.append("validation", validation);

  const request = await fetch("https://api.cevimedone.com/technician-form/", {
    method: "POST",
    body: formData,
  });
    

  const response = await request.json();
  if(response.status){
    preloader.style.display = 'none'
  }
  //
  if (response.status === "success") {
    if(response.type === '_imgpd_'){
      document.querySelector("#fileURL").value = "https://api.cevimedone.com/technician-form/" + response.url;
    }else{
      document.querySelector("#videoURL").value = "https://api.cevimedone.com/technician-form/" + response.url;
    }
    
  } else alert(response.message);

}

// Images And PDF files
document.getElementById("_imgpdf_").addEventListener("change", (e) =>{
  uploadFiles(e.target, '_imgpd_',  ["jpg", "jpeg", "png", "pdf"])
})
// Videos files
document.getElementById("_video_").addEventListener("change", (e) => {
   uploadFiles(e.target, '_video_',  ["mp4", "mpg", "avi", "mov"])
})


