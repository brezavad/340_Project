console.log("order.js loaded.");

// function addInventory(event) {
//     let payload = payloadBuilder(page, 'add');

//     console.log(payload);
    

  
//     event.preventDefault();
//   }
  
//   let page = "inventory";
//   let submit = "submit-inventory";
  
//   let submitButton = document.getElementById(submit);
//   submitButton.addEventListener('click', addInventory);

function deleteComputerTable() {
  let rowNumber = computerTable.rows.length;

  for (var i = rowNumber; i > 1; i--) {
    computerTable.deleteRow(i - 1);
  }
}

function buildComputerTable(data) {
  let length = data.length;
  let j = 1;

  console.log(length);

  if (length == 0) {
    alert("No inventory at this store.");
    return;
  }

  for (var i = 0; i < length; i++) {
    let row = computerTable.insertRow(j);

    let cell0 = row.insertCell(0);
    let cell1 = row.insertCell(1);
    let cell2 = row.insertCell(2);
    let cell3 = row.insertCell(3);
    let cell4 = row.insertCell(4);
    let cell5 = row.insertCell(5);

    cell0.innerText = data[i].computer_id;
    cell1.innerText = data[i].description;
    cell2.innerText = data[i].ram;
    cell3.innerText = data[i].hard_drive;
    cell4.innerText = data[i].screen_size;
    cell5.innerText = data[i].quantity;

    j++;
  }
}

function deleteComputerOptions() {
  let length = computerList.length;

  for (var i = length; i > 1; i--) {
    computerList.remove(i - 1);
  }
}

function buildComputerOptions(data) {
  let length = data.length;

  for (var i = 0; i < length; i++) {
    let option = document.createElement('option');
    option.value = data[i].computer_id;
    option.innerText = data[i].computer_id;
    computerList.append(option);
  }
}

function storeChanged(event) {
  let payload = payloadBuilder(page, 'store');
  deleteComputerTable();
  deleteComputerOptions();

  sendPostAjax(payload, page)
    .then((responseData) => {
      data = JSON.parse(responseData);

      buildComputerTable(data);
      buildComputerOptions(data);
    });

  event.preventDefault();
}

function placeOrder(event) {
  let payload = payloadBuilder(page, 'order');
  console.log(payload);

  sendPostAjax(payload, page)
    .then((responseData) => {
      alert(responseData);
    });

  event.preventDefault();
}

const page = "order";
const select = "store-info";
const computerTable = document.getElementById("computer-table");
const storeTable = document.getElementById("store-table");
const computerList = document.getElementById("computer-info");
const storeSelect = document.getElementById(select);
storeSelect.addEventListener('change', storeChanged);
const orderButton = document.getElementById("place-order");
orderButton.addEventListener('click', placeOrder);