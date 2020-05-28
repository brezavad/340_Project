console.log("computers.js loaded.");

const page = "computers";
const submit = "submit-computer";
const table = "computer-table";

const submitButton = document.getElementById(submit);
const tableElement = document.getElementById(table);

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

function deleteComputer(computerId) {
  let payload = {};
  let data = {};

  payload.page = page;
  payload.type = 'delete';
  data.computerId = computerId;
  payload.data = data;

  console.log(payload);
  
  sendPostAjax(payload, page)
    .then((responseData) => {
      alert(responseData);
      window.location.href = "./" + page;
    });
}

function getComputerId(target) {
  let td = target.parentElement;
  let tr = td.parentElement;
  let children = tr.children;

  return children[0].innerText;
}

function tableClick(event) {
  let target = event.target;

  if (target.classList.contains('deleteComputerBtn')) {
    let computerId = getComputerId(target);
    deleteComputer(computerId);
  }

  event.preventDefault();
  event.stopPropagation();
}

tableElement.addEventListener('click', tableClick);
submitButton.addEventListener('click', addComputer);
