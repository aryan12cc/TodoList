/*
Todo: 
- Make the checkboxes a button, and update it in server.js API
- Get the API and delete the items
*/

document.addEventListener('DOMContentLoaded', function () {
    var addItemForm = document.getElementById('addItemForm');
    var todoList = document.getElementById('todoList');
    var addItemInput = document.getElementById('addItem');
    var deleteItems = document.getElementById('deleteItemsButton');

    fetchTodoList();

    addItemForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addItem();
    });

    todoList.addEventListener('change', function (event) {
        event.preventDefault();
        updateAllItems();
    });

    deleteItems.addEventListener('click', function (event) {
        event.preventDefault();
        deleteCheckedItems();
    });

    function addItem() {
        var addItemText = addItemInput.value.trim();

        if (addItemText !== '') {
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
                        fetchTodoList();
                        addItemInput.value = '';
                    } else {
                        console.error('Failed to add item:', data.message);
                    }
                })
                .catch(error => console.error(error));
        }
    }

    function updateAllItems() {
        const todoListItems = document.querySelectorAll('#todoList li');
        const itemList = Array.from(todoListItems).map(item => item.textContent);

        const checkboxes = todoList.querySelectorAll('input[type="checkbox"]');

        const checkBoxList = Array.from(checkboxes).map(item => item.checked);

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
                    fetchTodoList();
                } else {
                    console.error('Failed to add item:', data.message);
                }
            })
            .catch(error => console.error(error));
    }

    function deleteCheckedItems() {
        const todoListItems = document.querySelectorAll('#todoList li');
        const itemList = Array.from(todoListItems).map(item => item.textContent);

        const checkboxes = todoList.querySelectorAll('input[type="checkbox"]');

        const checkBoxList = Array.from(checkboxes).map(item => item.checked);

        fetch('/api/DeleteCheckedItems', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ list: itemList, checkbox: checkBoxList}),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchTodoList();
                } else {
                    console.error('Failed to add item:', data.message);
                }
            })
            .catch(error => console.error(error));
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
    }

    function fetchTodoList() {
        fetch('/api/TodoList')
            .then(response => response.json())
            .then(data => {
                renderTodoList(data);
            })
            .catch(error => console.error(error));
    }

    // Function to render the to-do list in the UI
    function renderTodoList(items) {

        var actualList = []
        for(let i = 0; i < items.length; i++)
        {
            actualList.push(items[i].content);
        }

        todoList.innerHTML = '';
        for(let i = 0; i < actualList.length; i++)
        {
            var newItem = document.createElement('li');

            var label = document.createElement('label');
            label.className = 'checkbox-container';

            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = items[i].isChecked;

            var checkmark = document.createElement('span');
            checkmark.className = 'checkmark';

            label.appendChild(checkbox);
            label.appendChild(checkmark);

            label.appendChild(document.createTextNode(actualList[i]));

            newItem.appendChild(label);
            todoList.appendChild(newItem);
        }
    }
});
