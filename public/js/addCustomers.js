console.log("addCustomers.js has loaded.");

const page = 'addcustomers';
const add = "add-customers";
const search = "search-customers";
const update = "update-customer";

const submitLabel = "Insert into customers";
const updateLabel = "Update customer info";

let submitButton = document.getElementById(add);
let searchButton = document.getElementById(search);
// let updateButton = document.getElementById(update);

submitButton.value = submitLabel;
submitButton.innerText = submitLabel;

// function addCustomers(event) {
//   let payload = payloadBuilder(page, 'add');
  
//   sendPostAjax(payload, page)
//     .then((responseData) => {
//       alert(responseData);
//     });

//   event.preventDefault();
// }

function reloadWindow() {
  window.location.href = "./" + page;
}

function pageCustomersAdd() {
  let payload = payloadBuilder(page, 'add');
  
  sendPostAjax(payload, page)
    .then((responseData) => {
      alert(responseData);
      reloadWindow();
    });
}

function fillCustomerForm(data) {
  let c_id = document.getElementById("customer-id");
  let fn = document.getElementById("first-name");
  let ln = document.getElementById("last-name");
  let email = document.getElementById("email");

  c_id.value = data[0].customer_id;
  fn.value = data[0].first_name;
  ln.value = data[0].last_name;
  email.value = data[0].email;
}

function searchCustomers(event) {
  let payload = payloadBuilder(page, 'search');
  
  sendPostAjax(payload, page)
    .then((responseData) => {
      data = JSON.parse(responseData);

      console.log(data);

      if (data.length > 0) {
        fillCustomerForm(data);
        alert("Customer found.");
        changeButtonValue(updateLabel);
      }
      else {
        alert("Customer not found.");
      }
    });

  event.preventDefault();
}

// function updateCustomer(event) {
//   let payload = payloadBuilder(page, 'update');
//   console.log(payload);
  
//   sendPostAjax(payload, page)
//     .then((responseData) => {
//       alert(responseData);
//     });

//   event.preventDefault();
// }

function pageCustomersUpdate() {
  let payload = payloadBuilder(page, 'update');
  console.log(payload);
  
  sendPostAjax(payload, page)
    .then((responseData) => {
      alert(responseData);
      reloadWindow();
    });
}

function changeButtonValue(value) {
  submitButton.value = value;
  submitButton.innerText = value;
}

function submitClick(event) {
  if (submitButton.value == submitLabel) {
    pageCustomersAdd();
  }
  else if (submitButton.value == updateLabel) {
    pageCustomersUpdate();
    changeButtonValue(submitLabel);
  }

  event.preventDefault();
}

submitButton.addEventListener('click', submitClick);
searchButton.addEventListener('click', searchCustomers);
// updateButton.addEventListener('click', updateCustomer);