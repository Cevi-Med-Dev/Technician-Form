var call_form_ = document.querySelector("#formContainer form");
var call_formData = new FormData(call_form_);
var call_params = "";
var rate = document.querySelector(".smileRating");
var rateOptions = document.querySelectorAll(".smileRating img");

rateOptions.forEach((rate) => {
  rate.addEventListener("click", () => {
    rateOptions.forEach(rate => rate.src = `./assets/imgs/${rate.name}.svg`)
    rate.src = `./assets/imgs/${rate.name}Selected.svg`;
    document.getElementById("moodRate").value = rate.name
    console.log(document.getElementById("moodRate").value, " = ", rate.name)
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
  
document.querySelectorAll("input[type=checkbox]").forEach(checkBox => {
  console.log(checkBox, checkBox.value, checkBox.name)
  checkBox.checked && call_formData.append(`${checkBox.name}`, `${checkBox.value}`)
})
document.querySelectorAll("input[type=radio]").forEach(radioBtn => {
  radioBtn.checked && call_formData.append(`${radioBtn.name}`, `${radioBtn.value}`)
})
  console.log(call_formData,call_formData.entries())
  for (var [key, value] of call_formData.entries()) {
    call_params += `${key}=${
    
      document.querySelector("*[name=" + key + "] ").value //  finds first radius and always sends 20%
    }&`;
    console.log(key, value)
  }

  // dataObject = Object.fromEntries(fn)
  console.log("this is the data retreived", call_params);
  call_trigger(
    "https://hooks.airtable.com/workflows/v1/genericWebhook/appELJwYYus7qLt4Q/wflAs9AHZzei3EO7D/wtrC6Af88tnEk0Sb7",
    call_params
  ).then((data) => {
    console.log(data);
    call_form_.reset();
    window.alert("Your Daily Report Has Been Sent! thank you!")
    // window.location.reload()
  });

});
