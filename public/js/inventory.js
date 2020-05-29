console.log("inventory.js loaded.");

const page = "inventory";
const submit = "submit-inventory";
const update = "update-inventory";
const table = "inventory-table";
const submitLabel = "Insert into inventory";
const updateLabel = "Update inventory";

let submitButton = document.getElementById(submit);
let tableElement = document.getElementById(table);
// let updateButton = document.getElementById(update);

submitButton.value = submitLabel;
submitButton.innerText = submitLabel;

// function addInventory(event) {
//   let payload = payloadBuilder(page, 'add');

//   console.log(payload);
  
//   sendPostAjax(payload, page)
//     .then((responseData) => {
//       alert(responseData);
//       window.location.href = "./" + page;
//     });

//   event.preventDefault();
// }

function pageInventoryAdd() {
  console.log("this is working");
  let payload = payloadBuilder(page, 'add');

  console.log(payload);
  
  sendPostAjax(payload, page)
    .then((responseData) => {
      alert(responseData);
      window.location.href = "./" + page;
    });
}

// function updateInventory(event) {
//   let payload = payloadBuilder(page, 'update');

//   console.log(payload);
  
//   sendPostAjax(payload, page)
//     .then((responseData) => {
//       alert(responseData);
//       window.location.href = "./" + page;
//     });

//   event.preventDefault();
// }

function pageInventoryUpdate() {
  let payload = payloadBuilder(page, 'update');

  console.log(payload);
  
  sendPostAjax(payload, page)
    .then((responseData) => {
      alert(responseData);
      window.location.href = "./" + page;
    });
}

function deleteInventory(inventoryId) {
  let payload = {};
  let data = {};

  payload.page = page;
  payload.type = 'delete';
  data.inventoryId = inventoryId;
  payload.data = data;

  console.log(payload);
  
  sendPostAjax(payload, page)
    .then((responseData) => {
      alert(responseData);
      window.location.href = "./" + page;
    });
}

function fillInventoryTable(target) {
  let i_id = document.getElementById("inventory-id");
  let store = document.getElementById("store-id");
  let computer = document.getElementById("computer-id");
  let quantity = document.getElementById("computer-quantity");

  let td = target.parentElement;
  let tr = td.parentElement;
  let children = tr.children;

  i_id.value = children[0].innerText;
  store.value = children[2].innerText;
  computer.value = children[4].innerText;
  quantity.value = children[1].innerText;
}

function getInventoryId(target) {
  let td = target.parentElement;
  let tr = td.parentElement;
  let children = tr.children;

  return children[0].innerText;
}

function tableClick(event) {
  let target = event.target;

  if (target.classList.contains('editInventoryBtn')) {
    fillInventoryTable(target);
    changeButtonValue(updateLabel);
  }
  else if (target.classList.contains('deleteInventoryBtn')) {
    let inventoryId = getInventoryId(target);
    deleteInventory(inventoryId);
  }

  event.preventDefault();
  event.stopPropagation();
}

function changeButtonValue(value) {
  submitButton.value = value;
  submitButton.innerText = value;
}

function submitClick(event) {
  if (submitButton.value == submitLabel) {
    pageInventoryAdd();
    console.log(submitButton.value + " 2");
  }
  else if (submitButton.value == updateLabel) {
    pageInventoryUpdate();
    changeButtonValue(submitLabel);
  }

  event.preventDefault();
}

submitButton.addEventListener('click', submitClick);
tableElement.addEventListener('click', tableClick);
// updateButton.addEventListener('click', updateInventory);
