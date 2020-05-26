console.log("computers.js loaded.");

const page = "computers";
const submit = "submit-computer";

const submitButton = document.getElementById(submit);
submitButton.addEventListener('click', addComputer);

function addComputer(event) {
    let payload = payloadBuilder(page, 'add');

    console.log(payload);
    
    sendPostAjax(payload, page)
      .then((responseData) => {
        alert(responseData);
        window.location.href = "./" + page;
      });
  
    event.preventDefault();
  }
