/*
Todo: 
- Make the checkboxes a button, and update it in server.js API
- Get the API and delete the items
*/

document.addEventListener('DOMContentLoaded', function () {
    var addItemForm = document.getElementById('addItemForm');
    // var deleteItemForm = document.getElementById('deleteItemForm');
    var todoList = document.getElementById('todoList');
    var addItemInput = document.getElementById('addItem');
    // var deleteItemInput = document.getElementById('deleteItem');

    // fetches the current todo list
    fetchTodoList();

    addItemForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addItem();
    });

    todoList.addEventListener('change', function (event) {
        event.preventDefault();
        updateAllItems();
    });

    

    // deleteItemForm.addEventListener('submit', function (event) {
    //     event.preventDefault();
    //     deleteItem();
    // });

    function addItem() {
        var addItemText = addItemInput.value.trim();

        if (addItemText !== '') {
            // node request to add a new item to the to-do list
            fetch('/api/AddItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newItem: addItemText}),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // If the item is added successfully, update the UI
                        fetchTodoList();
                        addItemInput.value = '';
                        // console.log('Added item with: ', addItemText);
                    } else {
                        console.error('Failed to add item:', data.message);
                    }
                })
                .catch(error => console.error(error));
        }
    }

    function updateAllItems() {
        // console.log("Coming to updateItem() with todoList = ", todoList);
        const todoListItems = document.querySelectorAll('#todoList li');
        // console.log("todoList items = ", todoListItems);
        const itemList = Array.from(todoListItems).map(item => item.textContent);
        // console.log("item list = ", itemList);


        const checkboxes = todoList.querySelectorAll('input[type="checkbox"]');

        const checkBoxList = Array.from(checkboxes).map(item => item.checked);

        // console.log("checkboxes = ", checkBoxList);
        checkboxes.forEach(checkbox => {
            const itemId = checkbox.id;
            const isChecked = checkbox.checked;
            // console.log(`Item ${itemId}: ${isChecked}`);
        });


        fetch('/api/UpdateAllItems', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ list: itemList, checkbox: checkBoxList}),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // If the checkbox is updated successfully, update the UI
                    fetchTodoList();
                } else {
                    console.error('Failed to add item:', data.message);
                }
            })
            .catch(error => console.error(error));
    }

    // function deleteItem() {
    //     var deleteItemText = deleteItemInput.value.trim();

    //     if(deleteItemText !== '') {
    //         // node request to delete the item from todo list
    //         fetch('/api/deleteitem', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ newItem: deleteItemText }),
    //         })
    //             .then(response => response.json())
    //             .then(data => {
    //                 if(data.success) {
    //                     fetchTodoList();
    //                     deleteItemInput.value = '';
    //                 }
    //                 else {
    //                     console.error('Failed to delete item: ',data.message);
    //                 }
    //             })
    //             .catch(error => console.error('Error'))
    //     }
    // }

    // Function to fetch the to-do list from the server
    function fetchTodoList() {
        fetch('/api/TodoList')
            .then(response => response.json())
            .then(data => {
                // Update the UI with the fetched to-do list
                // console.log("script.js line 132: The data I have got from fetching the todo list is", data);
                renderTodoList(data);
            })
            .catch(error => console.error(error));
    }

    // Function to render the to-do list in the UI
    function renderTodoList(items) {

        // console.log("In renderTodoList");
        // items.forEach(item => {
        //     console.log(item);
        // });

        // console.log("the data i have to render is", items);

        var actualList = []
        for(let i = 0; i < items.length; i++)
        {
            actualList.push(items[i].content);
        }

        // console.log("actual list is", actualList);

        todoList.innerHTML = '';
        for(let i = 0; i < actualList.length; i++)
        {
            var newItem = document.createElement('li');

            var label = document.createElement('label');
            label.className = 'checkbox-container';

            // Create the checkbox input
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = items[i].isChecked;

            // Create the checkmark span for styling
            var checkmark = document.createElement('span');
            checkmark.className = 'checkmark';

            // Append the checkbox and checkmark to the label
            label.appendChild(checkbox);
            label.appendChild(checkmark);

            label.appendChild(document.createTextNode(actualList[i]));

            // Append the label to the list item
            newItem.appendChild(label);
            todoList.appendChild(newItem);
        }
        // console.log(todoList);
        // actualList.forEach(item => {
        //     var newItem = document.createElement('li');

        //     var label = document.createElement('label');
        //     label.className = 'checkbox-container';

        //     // Create the checkbox input
        //     var checkbox = document.createElement('input');
        //     checkbox.type = 'checkbox';

        //     // Create the checkmark span for styling
        //     var checkmark = document.createElement('span');
        //     checkmark.className = 'checkmark';

        //     // Append the checkbox and checkmark to the label
        //     label.appendChild(checkbox);
        //     label.appendChild(checkmark);

        //     label.appendChild(document.createTextNode(item));

        //     // Append the label to the list item
        //     newItem.appendChild(label);
        //     todoList.appendChild(newItem);
        // });
    }
});
