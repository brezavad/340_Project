function setSubmitButtonValue(newValue) {
  var button = document.getElementById("submit");
  button.value = newValue;
}

function getSubmitButtonValue() {
  var button = document.getElementById("submit");
  return button.getAttribute("value");
}

function deleteTable() {
  var rows = document.getElementsByClassName("tableContentRow");

  while(rows.length > 0) {
    rows[0].parentNode.removeChild(rows[0]);
  }
}

function buildTable(data) {
  var table = document.getElementById("table");

  for (var i = 0; i < data.length; i++) {
    var row = document.createElement("tr");
    row.setAttribute("class", "tableContentRow");

    var name = document.createElement("td");
    var reps = document.createElement("td");
    var weight = document.createElement("td");
    var date = document.createElement("td");
    var units = document.createElement("td");
    var actions = document.createElement("td");
    var form = document.createElement("form");
    var id = document.createElement("input");
    var edit = document.createElement("input");
    var deleteBtn = document.createElement("input");
    
    name.textContent = data[i].name;
    reps.textContent = data[i].reps;
    weight.textContent = data[i].weight;
    date.textContent = data[i].date.substring(0, 10);

    if (data[i].lbs == 1) {
      units.textContent = "lbs";
    }
    else {
      units.textContent = "kgs";
    }

    id.setAttribute("type", "hidden");
    id.setAttribute("value", data[i].id);

    edit.setAttribute("type", "submit");
    edit.setAttribute("value", "edit");
    edit.setAttribute("class", "editBtn");

    deleteBtn.setAttribute("type", "submit");
    deleteBtn.setAttribute("value", "delete");
    deleteBtn.setAttribute("class", "deleteBtn");

    form.appendChild(id);
    form.appendChild(edit);
    form.appendChild(deleteBtn);
    actions.appendChild(form);

    row.appendChild(name);
    row.appendChild(reps);
    row.appendChild(weight);
    row.appendChild(date);
    row.appendChild(units);
    row.appendChild(actions);
    table.appendChild(row);
  }
}

function postAjax(payload) {
  var req = new XMLHttpRequest();
  req.open('POST', '/', true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.addEventListener('load', function() {
    if (req.status == 200) {
      var data = JSON.parse(req.responseText);

      deleteTable();
      buildTable(data);
    }
    else {
      alert(req.responseText);
    }
  });
  req.send(JSON.stringify(payload));
}

function postSubmit(data) {
  var payload = {
    "type":"submit",
    "data":data
  };

  postAjax(payload);
}

function postUpdate(data) {
  var payload = {
    "type":"update",
    "data":data
  };

  postAjax(payload);
}

function postInitial(event) {
  var payload = {
    "type":"initial",
    "data":null
  };

  postAjax(payload);
  event.preventDefault();
}

function postDelete(rowValues) {
  var formContent = {};
  var payload = {};

  formContent["id"] = rowValues[0];
  payload = {
    "type":"delete",
    "data":"Hello"
  };

  postAjax(payload);
}

function submitClick(event) {
  var formContent = {};

  formContent["id"] = document.getElementById("idInput").value;
  formContent["name"] = document.getElementById("nameInput").value;
  formContent["reps"] = document.getElementById("repsInput").value;
  formContent["weight"] = document.getElementById("weightInput").value;
  formContent["date"] = document.getElementById("dateInput").value;
  formContent["unit"] = document.getElementById("unitInput").value;

  if (getSubmitButtonValue() == "Submit") {
    postSubmit(formContent);
  }
  else if (getSubmitButtonValue() == "Update") {
    postUpdate(formContent);
  }

  resetForm();
  event.preventDefault();
  event.stopPropagation();
}

function resetForm() {
  document.getElementById("infoForm").reset();
  setSubmitButtonValue("Submit");
}

function clearClick(event) {
  resetForm();
  event.preventDefault();
  event.stopPropagation();
}

function fillUpdateForm(data) {
  var unitValue;

  document.getElementById("idInput").value = data[0];
  document.getElementById("nameInput").value = data[1];
  document.getElementById("repsInput").value = data[2];
  document.getElementById("weightInput").value = data[3];
  document.getElementById("dateInput").value = data[4];

  if (data[5] == "lbs") {
    unitValue = "1";
  }
  else {
    unitValue = "0";
  }

  document.getElementById("unitInput").value = unitValue;

  setSubmitButtonValue("Update");
}

function getRowValues(target) {
  var form = target.parentElement;
  var td = form.parentElement;
  var tr = td.parentElement;
  var children = tr.children;
  var rowValues = [];

  rowValues.push(form.children[0].getAttribute("value"));
  rowValues.push(children[0].innerText);
  rowValues.push(children[1].innerText);
  rowValues.push(children[2].innerText);
  rowValues.push(children[3].innerText);
  rowValues.push(children[4].innerText);

  return rowValues;
}

function tableClick(event) {
  var target = event.target;
  var rowValues = getRowValues(target);

  if (target.getAttribute("class") == "editBtn") {
    fillUpdateForm(rowValues);
  }
  else if (target.getAttribute("class") == "deleteBtn") {
    postDelete(rowValues);
  }

  event.preventDefault();
  event.stopPropagation();
}

document.getElementById("submit").addEventListener("click", submitClick);
document.getElementById("clear").addEventListener("click", clearClick);
document.getElementById("table").addEventListener("click", tableClick);
document.addEventListener("DOMContentLoaded", postInitial);
