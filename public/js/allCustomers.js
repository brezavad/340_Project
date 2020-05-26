console.log("allCustomers.js loaded.");

const page = 'allcustomers';
const table = "all-customer-table";
const tableElement = document.getElementById(table);

function deleteCustomer(customerId) {
  let payload = {};
  let data = {};
  payload.page = page;
  payload.type = 'delete';
  data.customerId = customerId;
  payload.data = data;
  
  sendPostAjax(payload, page)
    .then((responseData) => {
      alert(responseData);
      window.location.href = "./" + page;
    });
}

function getCustomerId(target) {
  let td = target.parentElement;
  let tr = td.parentElement;
  let children = tr.children;

  return children[0].innerText;
}

function tableClick(event) {
  let target = event.target;

  if (target.classList.contains('deleteCustomerBtn')) {
    let customerId = getCustomerId(target);
    deleteCustomer(customerId);
  }

  event.preventDefault();
  event.stopPropagation();
}

tableElement.addEventListener('click', tableClick);
