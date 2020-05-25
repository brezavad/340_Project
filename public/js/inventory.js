console.log("inventory.js loaded.");

function addInventory(event) {
    let payload = payloadBuilder(page, 'add');

    console.log(payload);
    
    sendPostAjax(payload, page)
      .then((responseData) => {
        alert(responseData);
        window.location.href = "./inventory";
      });
  
    event.preventDefault();
  }
  
  let page = "inventory";
  let submit = "submit-inventory";
  
  let submitButton = document.getElementById(submit);
  submitButton.addEventListener('click', addInventory);