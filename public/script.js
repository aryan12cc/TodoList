

document.addEventListener('DOMContentLoaded', function () {
    var addItemForm = document.getElementById('addItemForm');
    var deleteItemForm = document.getElementById('deleteItemForm');
    var todoList = document.getElementById('todoList');
    var addItemInput = document.getElementById('addItem');
    var deleteItemInput = document.getElementById('deleteItem');

    addItemForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addItem();
    });

    deleteItemForm.addEventListener('submit', function (event) {
        event.preventDefault();
        deleteItem();
    });

    function addItem() {
        var addItemText = addItemInput.value.trim();

        if (addItemText !== '') {
            // node request to add a new item to the to-do list
            fetch('/api/additem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newItem: addItemText }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // If the item is added successfully, update the UI
                        fetchTodoList();
                        addItemInput.value = '';
                    } else {
                        console.error('Failed to add item:', data.message);
                    }
                })
                .catch(error => console.error(error));
        }
    }

    function deleteItem() {
        var deleteItemText = deleteItemInput.value.trim();

        if(deleteItemText !== '') {
            // node request to delete the item from todo list
            fetch('/api/deleteitem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newItem: deleteItemText }),
            })
                .then(response => response.json())
                .then(data => {
                    if(data.success) {
                        fetchTodoList();
                        deleteItemText.value = '';
                    }
                    else {
                        console.error('Failed to delete item: ',data.message);
                    }
                })
                .catch(error => console.error('Error'))
        }
    }

    // Function to fetch the to-do list from the server
    function fetchTodoList() {
        fetch('/api/todolist')
            .then(response => response.json())
            .then(data => {
                // Update the UI with the fetched to-do list
                renderTodoList(data);
            })
            .catch(error => console.error(error));
    }

    // Function to render the to-do list in the UI
    function renderTodoList(items) {
        todoList.innerHTML = '';
        items.forEach(item => {
            var newItem = document.createElement('li');
            newItem.textContent = item;
            todoList.appendChild(newItem);
        });
    }

    // Initial fetch of the to-do list when the page loads
    fetchTodoList();
});
