const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

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

function operateTodoList(req, operation) {
    if(operation == 'add') {
        const newItem = {
            ...item, 
            content: req.body.newItem, 
            isChecked: false
        };
        todoList.push(newItem);
        writeToFile('savedTodoList.txt');
        return;
    }
    const currentTodoList = req.body.list;
    const currentCheckmarkList = req.body.checkbox;
    todoList = [];
    for(let i = 0; i < currentTodoList.length; i++) {
        if(operation == 'delete' && currentCheckmarkList[i] == true) {
            continue;
        }
        let item = {content: currentTodoList[i], isChecked: currentCheckmarkList[i]};
        todoList.push(item);
    }
    writeToFile('savedTodoList.txt');
}

function readFromFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        const parsedData = JSON.parse(data);
        todoList = parsedData;
        return data;
    });
}

function writeToFile(filePath) {
    const todoListAsJson = JSON.stringify(todoList, null, 2);
    fs.writeFile(filePath, todoListAsJson, 'utf8', (err) => {
        if(err) {
            console.error(err);
            return;
        }
    });
}

app.post('/api/AddItem', (req, res) => {
    operateTodoList(req, 'add');
    console.log(todoList);
    res.json({ success: true, message: 'Item added successfully.' });
});

app.post('/api/UpdateAllItems', (req, res) => {
    operateTodoList(req, 'update');
    res.json({ success: true, message: 'Todo List updated successfully.'});
});

app.post('/api/DeleteCheckedItems', (req, res) => {
    operateTodoList(req, 'delete');
    res.json({ success: true, message: 'Todo List updated successfully.'});
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    readFromFile('savedTodoList.txt');
});
