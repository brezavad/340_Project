console.log("payloadBuilder.js has been loaded.");

function getId(name) {
    return document.getElementById(name);
}

function searchCustomers() {
    let data = {};
    let element = getId("existing-email");

    data.email = element.value;

    return data;
}

function addCustomer() {
    let data = {};
    let firstName = getId("first-name");
    let lastName = getId("last-name");
    let email = getId("email");

    data.firstName = firstName.value;
    data.lastName = lastName.value;
    data.email = email.value;

    return data;
}

function updateCustomer() {
    let customerId = getId("customer-id");
    data = addCustomer();

    data.customerId = customerId.value;

    return data;
}

function processAddCustomersPage(type) {
    if (type == "add") {
        return addCustomer();
    }
    else if (type == "search") {
        return searchCustomers();
    }
    else if (type == "update") {
        return updateCustomer();
    }

    return null;
}

function addStore() {
    let data = {}
    let address = getId("store-address");
    let city = getId("store-city");
    let state = getId("store-state");
    let zip = getId("store-zip");

    data.address = address.value;
    data.city = city.value;
    data.state = state.value;
    data.zip = zip.value;

    return data;
}

function processStoresPage(type) {
    if (type == "add") {
        return addStore();
    }

    return null;
}

function addInventory() {
    let data = {};
    let store_id = getId("store-id");
    let computer_id = getId("computer-id");
    let quant = getId("computer-quantity");

    data.store_id = store_id.value;
    data.computer_id = computer_id.value;
    data.quant = quant.value;

    return data;
}

function updateInventory() {
    let i_id = getId("inventory-id");
    let data = addInventory();

    data.inventory_id = i_id.value;

    return data;
}

function processInventoryPage(type) {
    if (type == "add") {
        return addInventory();
    }
    else if (type == "update") {
        return updateInventory();
    }

    return null;
}

function getStoreId() {
    let data = {};
    let store = getId("store-info");

    data.store = store.value;

    return data;
}

function placeOrder() {
    let data = {};
    let email = getId("order-email");
    let store = getId("store-info");
    let comp = getId("computer-info");
    let quant = getId("order-quantity");

    data.email = email.value;
    data.store = store.value;
    data.computer = comp.value;
    data.quantity = quant.value;

    return data;
}

function processOrderPage(type) {
    if (type == "store") {
        return getStoreId();
    }
    else if (type == "order") {
        return placeOrder();
    }
}

function addComputer() {
    let data = {};
    let descr = getId("computer-description");
    let ram = getId("computer-ram");
    let drive = getId("computer-hard-drive");
    let screen = getId("computer-screen-size");

    data.descr = descr.value;
    data.ram = ram.value;
    data.drive = drive.value;
    data.screen = screen.value;

    return data;
}

function processComputersPage(type) {
    if (type == "add") {
        return addComputer();
    }
}

function payloadBuilder(page, type) {
    let payload = {};
    payload.page = page;
    payload.type = type;
    payload.data = null;

    if (page == 'addcustomers') {
        payload.data = processAddCustomersPage(type);
    }
    else if (page == 'stores') {
        payload.data = processStoresPage(type);
    }
    else if (page == 'inventory') {
        payload.data = processInventoryPage(type);
    }
    else if (page == 'order') {
        payload.data = processOrderPage(type);
    }
    else if (page == 'computers') {
        payload.data = processComputersPage(type);
    }

    return payload;
}