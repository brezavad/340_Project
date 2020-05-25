console.log("addCustomers.js has loaded.");

function addCustomers(event) {
  let payload = payloadBuilder(page, 'add');
  
  sendPostAjax(payload, page)
    .then((responseData) => {
      alert(responseData);
    });

  event.preventDefault();
}

let page = 'addcustomers';
let add = "add-customers";
let search = "search-customers";

let addButton = document.getElementById(add);

addButton.addEventListener('click', addCustomers);