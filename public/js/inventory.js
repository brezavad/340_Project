console.log("inventory.js loaded.");

const page = "inventory";
const submit = "submit-inventory";
const update = "update-inventory";
const table = "inventory-table";

const submitButton = document.getElementById(submit);
const tableElement = document.getElementById(table);
const updateButton = document.getElementById(update);

function addInventory(event) {
  let payload = payloadBuilder(page, 'add');

  console.log(payload);
  
  sendPostAjax(payload, page)
    .then((responseData) => {
      alert(responseData);
      window.location.href = "./" + page;
    });

  event.preventDefault();
}

function updateInventory(event) {
  let payload = payloadBuilder(page, 'update');

  console.log(payload);
  
  sendPostAjax(payload, page)
    .then((responseData) => {
      alert(responseData);
      window.location.href = "./" + page;
    });

  event.preventDefault();
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
  }
  else if (target.classList.contains('deleteInventoryBtn')) {
    let inventoryId = getInventoryId(target);
    deleteInventory(inventoryId);
  }

  event.preventDefault();
  event.stopPropagation();
}

submitButton.addEventListener('click', addInventory);
tableElement.addEventListener('click', tableClick);
updateButton.addEventListener('click', updateInventory);
