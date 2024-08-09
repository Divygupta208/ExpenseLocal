var form = document.getElementById("addForm");
var items = document.getElementById("itemlist");
var editingItemId = null;
document.addEventListener("DOMContentLoaded", init);
form.addEventListener("submit", addItem);

// items.addEventListener("click", deleteItem);

function init() {
  axios
    .get("http://localhost:3000/expense/get-expenses")
    .then((response) => {
      const storedItems = response.data;
      if (storedItems && storedItems.length > 0) {
        storedItems.forEach((item) => {
          addItemToUI(item);
        });
      }
    })
    .catch((error) => {
      console.error("There was an error fetching the expenses!", error);
    });
}

function addItem(e) {
  e.preventDefault();

  var newItem = document.getElementById("amount").value;
  var newItemDes = document.getElementById("desc").value;
  var newItemCat = document.getElementById("category").value;

  var myobj = {
    amount: newItem,
    description: newItemDes,
    category: newItemCat,
  };

  if (editingItemId) {
    axios
      .put(`http://localhost:3000/expense/edit-expense/${editingItemId}`, myobj)
      .then((response) => {
        addItemToUI(response.data.exp);
        resetForm();
        editingItemId = null;
      })
      .catch((error) => {
        console.error("There was an error updating the expense!", error);
      });
  } else {
    // Adding a new item
    axios
      .post("http://localhost:3000/expense/post-expense", myobj)
      .then((response) => {
        addItemToUI(response.data.exp);
        resetForm();
      })
      .catch((error) => {
        console.error("There was an error adding the expense!", error);
      });
  }
}

function addItemToUI(item) {
  var Li = document.createElement("li");
  Li.className = "items";

  var deleteBtn = document.createElement("button");
  var editBtn = document.createElement("button");
  deleteBtn.className = "btn btn-danger btn-sm ms-4 float-right delete";
  editBtn.className = "btn btn-success btn-sm ms-4 float-right";
  deleteBtn.appendChild(document.createTextNode("X"));
  editBtn.appendChild(document.createTextNode("Edit"));

  var itemText = document.createTextNode(
    item.amount + "-" + item.description + "-" + item.category
  );
  Li.appendChild(itemText);
  Li.appendChild(deleteBtn);
  Li.appendChild(editBtn);

  items.appendChild(Li);

  deleteBtn.addEventListener("click", function () {
    deleteItemFromAPI(item.id);
    removeItemFromUI(Li);
  });

  editBtn.onclick = () => {
    document.getElementById("btn").innerHTML = "Edit";
    document.getElementById("amount").value = item.amount;
    document.getElementById("desc").value = item.description;
    document.getElementById("category").value = item.category;

    editingItemId = item.id;
    removeItemFromUI(Li);
  };
}

// function deleteItem(e) {
//   if (e.target.classList.contains("delete")) {
//     let data = e.target.parentElement;
//     let itemId = data.getAttribute("data-id");

//     axios
//       .delete(`http://localhost:3000/expense/delete-expense/${itemId}`)
//       .then(() => {
//         removeItemFromUI(data);
//       })
//       .catch((error) => {
//         console.error("There was an error deleting the expense!", error);
//       });
//   }
// }

function removeItemFromUI(elem) {
  elem.remove();
}

function deleteItemFromAPI(id) {
  axios
    .delete(`http://localhost:3000/expense/delete-expense/${id}`)
    .then((response) => {
      console.log("Expense deleted successfully!");
    })
    .catch((error) => {
      console.error("There was an error deleting the expense!", error);
    });
}

function resetForm() {
  document.getElementById("amount").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("category").value = "";
}
