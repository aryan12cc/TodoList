document.addEventListener('DOMContentLoaded', function () {
    var addItemFormId = document.getElementById('addItemForm');
    var todoListId = document.getElementById('todoList');
    var addItemInputId = document.getElementById('addItemInput');
    var deleteItemsId = document.getElementById('deleteItems');

    fetchTodoList();

    addItemFormId.addEventListener('submit', function (event) {
        event.preventDefault();
        addItem();
    });

    todoListId.addEventListener('change', function (event) {
        event.preventDefault();
        updateAndDeleteItems('/api/UpdateAllItems');
    });

    deleteItemsId.addEventListener('click', function (event) {
        event.preventDefault();
        updateAndDeleteItems('/api/DeleteCheckedItems');
    });

    function addItem() {
        var addItemText = addItemInputId.value.trim();

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

    function updateAndDeleteItems(url) {
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

        var actualList = []
        for(let i = 0; i < items.length; i++)
        {
            actualList.push(items[i].content);
        }

        todoListId.innerHTML = '';
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
            todoListId.appendChild(newItem);
        }
    }
});
