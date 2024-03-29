document.addEventListener('DOMContentLoaded', function() {
    let addItemFormId = document.getElementById('addItemForm');
    let todoListId = document.getElementById('todoList');
    let addItemInputId = document.getElementById('addItemInput');
    let deleteItemsId = document.getElementById('deleteItems');
    let logoutUserId = document.getElementById('logoutUser');

    fetch('/api/CheckLogin', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if(response.status == 401) {
                window.location.href = 'index.html';
            }
            else if(response.ok) {
                return response.json();
            }
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        })
    fetchTodoList();

    addItemFormId.addEventListener('submit', function (event) {
        event.preventDefault();
        addItem();
    });

    todoListId.addEventListener('change', function (event) {
        event.preventDefault();
        postListToAPI('/api/UpdateAllItems');
    });

    deleteItemsId.addEventListener('click', function (event) {
        event.preventDefault();
        postListToAPI('/api/DeleteCheckedItems');
    });

    logoutUserId.addEventListener('click', function (event) {
        event.preventDefault();
        logoutUser('/api/LogoutUser');
    });

    function addItem() {
        let addItemText = addItemInputId.value.trim();

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
                        addItemInputId.value = '';
                    } else {
                        console.error('Failed to add item:', data.message);
                    }
                })
                .catch(error => console.error(error));
        }
    }

    function getItemsAndCheckBoxList() {
        const todoListItems = document.querySelectorAll('#todoList li');
        const itemList = Array.from(todoListItems).map(item => item.textContent);
        const checkboxes = todoListId.querySelectorAll('input[type="checkbox"]');
        const checkBoxList = Array.from(checkboxes).map(item => item.checked);
        return {items: itemList, checkbox: checkBoxList};
    }

    function postListToAPI(url) {
        const todoList = getItemsAndCheckBoxList();

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ list: todoList.items, checkbox: todoList.checkbox}),
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

    function fetchTodoList() {
        fetch('/api/TodoList')
            .then(response => response.json())
            .then(data => {
                renderTodoList(data);
            })
            .catch(error => console.error(error));
    }

    function renderTodoList(items) {

        let actualList = []
        for(let i = 0; i < items.length; i++)
        {
            actualList.push(items[i].content);
        }

        todoListId.innerHTML = '';
        for(let i = 0; i < actualList.length; i++)
        {
            let newItem = document.createElement('li');

            let label = document.createElement('label');
            label.className = 'checkbox-container';

            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = items[i].isChecked;

            let checkmark = document.createElement('span');
            checkmark.className = 'checkmark';

            label.appendChild(checkbox);
            label.appendChild(checkmark);

            label.appendChild(document.createTextNode(actualList[i]));

            newItem.appendChild(label);
            todoListId.appendChild(newItem);
        }
    }

    function logoutUser(url) {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify({ list: todoList.items, checkbox: todoList.checkbox}),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'index.html';
                }
            })
            .catch(error => console.error(error));
    }
});