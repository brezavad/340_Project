console.log("stores.js has loaded.");

function addStore(event) {
  let payload = payloadBuilder(page, 'add');
  
  sendPostAjax(payload, page)
    .then((responseData) => {
      alert(responseData);
      window.location.href = "./stores";
    });

  event.preventDefault();
}

let page = "stores";
let submit = "submit-store";

let submitButton = document.getElementById(submit);
submitButton.addEventListener('click', addStore);