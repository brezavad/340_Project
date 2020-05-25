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

function storeChanged(event) {
    let payload = payloadBuilder(page, 'store');

    sendPostAjax(payload, page)
      .then((responseData) => {
        alert(responseData);
      });

    event.preventDefault();
}

let page = "order";
let select = "store-info";
let storeSelect = document.getElementById(select);
storeSelect.addEventListener('change', storeChanged);