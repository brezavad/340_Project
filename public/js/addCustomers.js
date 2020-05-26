console.log("addCustomers.js has loaded.");

const page = 'addcustomers';
const add = "add-customers";
const search = "search-customers";
const update = "update-customer";

const addButton = document.getElementById(add);
const searchButton = document.getElementById(search);
const updateButton = document.getElementById(update);

function addCustomers(event) {
  let payload = payloadBuilder(page, 'add');
  
  sendPostAjax(payload, page)
    .then((responseData) => {
      alert(responseData);
    });

  event.preventDefault();
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
      }
      else {
        alert("Customer not found.");
      }
    });

  event.preventDefault();
}

function updateCustomer(event) {
  let payload = payloadBuilder(page, 'update');
  console.log(payload);
  
  sendPostAjax(payload, page)
    .then((responseData) => {
      alert(responseData);
    });

  event.preventDefault();
}

addButton.addEventListener('click', addCustomers);
searchButton.addEventListener('click', searchCustomers);
updateButton.addEventListener('click', updateCustomer);