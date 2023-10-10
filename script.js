var form = document.getElementById('addForm');
var items = document.getElementById('itemlist');

// Initialize the item list when the page loads
document.addEventListener('DOMContentLoaded', init);


function init() {
    var storedItems = getItemLocal();

    if (storedItems && storedItems.length > 0) {
        
        storedItems.forEach(function (item) {
            addItemToUI(item);
        });
    }
}

form.addEventListener('submit', addItem);

function addItem(e) {
    e.preventDefault();

    var newItem = document.getElementById('amount').value;
    var newItemDes = document.getElementById('desc').value;
    var newItemCat = document.getElementById('category').value;

    var myobj = {
        Amount: newItem,
        Description: newItemDes,
        Category: newItemCat
    };

    addItemToUI(myobj);
    addItemLocal(myobj);
}

items.addEventListener('click', deleteItem);

function addItemToUI(item) {
    var Li = document.createElement('li');
    Li.className = "items";

    var deleteBtn = document.createElement('button');
    var editBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-sm ms-4 float-right delete';
    editBtn.className = 'btn btn-success btn-sm ms-4 float-right';
    deleteBtn.appendChild(document.createTextNode('X'));
    editBtn.appendChild(document.createTextNode('Edit'));

 
    var itemText = document.createTextNode(item.Amount + "-" + item.Description + "-" + item.Category);
    Li.appendChild(itemText);
    Li.appendChild(deleteBtn);
    Li.appendChild(editBtn);

    items.appendChild(Li);

    editBtn.onclick = () => {
        document.getElementById('amount').value = item.Amount;
        document.getElementById('desc').value = item.Description;
        document.getElementById('category').value = item.Category;
        removeItemFromUI(Li);
        removeLocal(item.Description);
    }
}

function addItemLocal(myobj) {
    let storedItems = getItemLocal();

    storedItems.push(myobj);

    localStorage.setItem('items', JSON.stringify(storedItems));
}

function getItemLocal() {
    let storedItems = localStorage.getItem('items');
    return storedItems ? JSON.parse(storedItems) : [];
}

function deleteItem(e) {
    let data, dataDesc;
    if (e.target.classList.contains('delete')) {
        e.target.parentElement.remove();
        data = e.target.parentElement;
        dataDesc = data.textContent.split("-")[1].trim(); // Extract description from text
        removeLocal(dataDesc);
    }
}

function removeLocal(dataDesc) {
    let storedItems = getItemLocal();

    storedItems = storedItems.filter(item => item.Description !== dataDesc);
    localStorage.setItem('items', JSON.stringify(storedItems));
}


init();

    
    
