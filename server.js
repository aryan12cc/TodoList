const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Use middleware to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

const item = {
    content: '',
    isChecked: false
};

// In-memory data storage
let todoList = [];

// API endpoint to get all the contents in the to-do list
app.get('/api/TodoList', (req, res) => {
    res.json(todoList);

    // let todoListReply = [];
    // console.log("Coming in /api/TodoList");
    // todoList.forEach(function(currentItem) {
    //     todoListReply.push(currentItem.content);
    //     console.log("current Item = ", currentItem.content, ", ", currentItem.isChecked);
    // });
    // res.json(todoListReply);
});

// API endpoint to add a new item to the to-do list
app.post('/api/AddItem', (req, res) => {
    const newItem = {
        ...item, 
        content: req.body.newItem, 
        isChecked: false
    };
    todoList.push(newItem);
    res.json({ success: true, message: 'Item added successfully.' });
});

app.post('/api/UpdateAllItems', (req, res) => {
    // console.log("All requests: ", req.body);
    const currentTodoList = req.body.list;
    const currentCheckmarkList = req.body.checkbox;
    // console.log("The current todo list is", currentTodoList);
    // console.log("The current checkmark list is", currentCheckmarkList);
    todoList = [];
    for(let i = 0; i < currentTodoList.length; i++)
    {
        let item = {content: currentTodoList[i], isChecked: currentCheckmarkList[i]};
        todoList.push(item);
    }
    // console.log("New todo list: ", todoList);
    res.json({ success: true, message: 'Todo List updated successfully.'});
});

// app.post('/api/deleteitem', (req, res) => {
//     const currentItem = req.body.newItem;
//     if(todoList.includes(currentItem) == false) {
//         res.json({ success: false, message: 'Item could not be found in the list.'});
//     }
//     else {
//         todoList = todoList.filter(element => element !== currentItem)
//         res.json({ success: true, message: 'Item deleted successfully.'})
//     }
// });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
