// Storage Controller
const StorageCtrl = (function () {

    //Public methods
    return {
        storeItem: function (item) {
            let items;

            //Check if there is any item in localStorage
            if (localStorage.getItem('items') === null) {
                items = [];
                //Push new item
                items.push(item);
                //Set localStorage
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                //Get what is in local storage
                items = JSON.parse(localStorage.getItem('items'));

                //Push new item
                items.push(item);

                //Reset local storage
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function () {
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function (updateditem) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function (item, index) {
                if (updateditem.id === item.id) {
                    items.splice(index, 1, updateditem);
                }
            });
            //Reset local storage
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function (id) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function (item, index) {
                if (id === item.id) {
                    items.splice(index, 1);
                }
            });
            //Reset local storage
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemFromStorage: function () {
            localStorage.removeItem('items');
        }
    }
})();

// Item Controller
const ItemCtrl = (function () {
    // Item Constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        // items: [
        //     // {id: 0, name: 'Steak Dinner', calories: 1200},
        //     // {id: 1, name: 'Cookie', calories: 400},
        //     // {id: 2, name: 'Eggs', calories: 300}
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    // Public methods
    return {
        getItems: function () {
            return data.items;
        },
        addItem: function (name, calories) {
            let ID;
            // Create ID
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Calories to number
            calories = parseInt(calories);

            // Create new item
            newItem = new Item(ID, name, calories);

            // Add to items array
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function (id) {
            let found = null;
            //Loop through the items
            data.items.forEach(function (item) {
                if (item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        updateItem: function (name, calories) {
            //Parse calories to int
            calories = parseInt(calories);

            let found = null;
            data.items.forEach(function (item) {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function (id) {
            //Get the ids
            const ids = data.items.map(function (item) {
                return item.id;
            });
            //Get index
            const index = ids.indexOf(id);

            //remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function () {
            data.items = [];
        },
        setCurrentItem: function (item) {
            data.currentItem = item;
        },
        getCurrentItem: function () {
            return data.currentItem;
        },

        getTotalCalories: function () {
            let total = 0;
            data.items.forEach(function (item) {
                total += item.calories;
            });
            //Set total cal in data structure
            data.totalCalories = total;

            //Return total
            return data.totalCalories;
        },
        logData: function () {
            return data;
        }
    }
})();


// UI Controller
const UICtrl = (function () {
    const UISelectors = {
        itemList: '#item-list',
        itemsList: '#item-list li',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
    }

    // Public methods
    return {
        populateItemList: function (items) {
            let html = '';

            items.forEach(function (item) {
                html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
            });

            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function (item) {
            // Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            // Add class
            li.className = 'collection-item';
            // Add ID
            li.id = `item-${item.id}`;
            // Add HTML
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;
            // Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        updateListItem: function (item) {
            let listItems = document.querySelectorAll(UISelectors.itemsList);

            //Turn node list to array
            listItems = Array.from(listItems);

            listItems.forEach(function (listItem) {
                const itemId = listItem.getAttribute('id');

                if (itemId === `item-${item.id}`) {
                    document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}: 
            </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;
                }
            });
        },
        deleteListItem: function (id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function () {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function () {
            let items = document.querySelectorAll(UISelectors.itemsList);

            //Turn nodes into array
            items = Array.from(items)

            items.forEach(function (item) {
                item.remove();
            });
        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function () {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function () {
            return UISelectors;
        }
    }
})();


// App Controller
const App = (function (ItemCtrl, UICtrl, StorageCtrl) {
    // Load event listeners
    const loadEventListeners = function () {
        // Get UI selectors
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //disable submit on enter
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        //Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        //Update btn event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        //Back btn event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        //Delete Item Event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        //Clear all items event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);


    }

    // Add item submit
    const itemAddSubmit = function (e) {
        // Get form input from UI Controller
        const input = UICtrl.getItemInput();

        // Check for name and calorie input
        if (input.name !== '' && input.calories !== '') {
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // Add item to UI list
            UICtrl.addListItem(newItem);

            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to the UI
            UICtrl.showTotalCalories(totalCalories);

            //Store in localStorage
            StorageCtrl.storeItem(newItem);

            // Clear fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    //Click item submit
    const itemEditClick = function (e) {
        if (e.target.classList.contains('edit-item')) {
            //Get the list item id
            const listId = e.target.parentNode.parentNode.id;

            //Break into an array
            const listIdArray = listId.split('-');

            //Get actual id
            const id = parseInt(listIdArray[1]);

            //Get item
            const itemToEdit = ItemCtrl.getItemById(id);

            //Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //Add item to form
            UICtrl.addItemToForm();

        }
        e.preventDefault();
    }
    //Update item submit
    const itemUpdateSubmit = function (e) {
        //Get item input
        const input = UICtrl.getItemInput();

        //Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        //Update UI
        UICtrl.updateListItem(updatedItem);

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);

        //Update localStorage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }
    const itemDeleteSubmit = function (e) {
        //Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        //Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);

        //Remove from localStorage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }
    const clearAllItemsClick = function (e) {
        //Delete all items from data structure
        ItemCtrl.clearAllItems();

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);

        //Remove from UI
        UICtrl.removeItems();

        //Clear all from local storage
        StorageCtrl.clearItemFromStorage();

        //Hide UL
        UICtrl.hideList();

        e.preventDefault();
    }

    // Public methods
    return {
        init: function () {
            //Set initial state
            UICtrl.clearEditState();

            // Fetch items from data structure
            const items = ItemCtrl.getItems();

            // Check if any items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                // Populate list with items
                UICtrl.populateItemList(items);
            }
            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to the UI
            UICtrl.showTotalCalories(totalCalories);

            // Load event listeners
            loadEventListeners();
        }
    }

})(ItemCtrl, UICtrl, StorageCtrl);

// Initialize App
App.init();