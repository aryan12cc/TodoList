const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const item = {
    content: '',
    isChecked: false
};

let todoList = [];

app.get('/api/TodoList', (req, res) => {
    res.json(todoList);
});

app.post('/api/AddItem', (req, res) => {
    const newItem = {
        ...item, 
        content: req.body.newItem, 
        isChecked: false
    };
    todoList.push(newItem);
    res.json({ success: true, message: 'Item added successfully.' });
});

function UpdateAndDeleteItems(req, operation) {
    const currentTodoList = req.body.list;
    const currentCheckmarkList = req.body.checkbox;
    todoList = [];
    for(let i = 0; i < currentTodoList.length; i++) {
        if(operation == "delete" && currentCheckmarkList[i] == true) {
            continue;
        }
        let item = {content: currentTodoList[i], isChecked: currentCheckmarkList[i]};
        todoList.push(item);
    }
}

app.post('/api/UpdateAllItems', (req, res) => {
    UpdateAndDeleteItems(req, "update");
    res.json({ success: true, message: 'Todo List updated successfully.'});
});

app.post('/api/DeleteCheckedItems', (req, res) => {
    UpdateAndDeleteItems(req, "delete");
    res.json({ success: true, message: 'Todo List updated successfully.'});
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
