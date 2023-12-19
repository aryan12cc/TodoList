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

// In-memory data storage
let todoList = [];

// API endpoint to get the to-do list
app.get('/api/todolist', (req, res) => {
    res.json(todoList);
});

// API endpoint to add a new item to the to-do list
app.post('/api/additem', (req, res) => {
    const newItem = req.body.newItem;
    todoList.push(newItem);
    res.json({ success: true, message: 'Item added successfully.' });
});

app.post('/api/deleteitem', (req, res) => {
    const currentItem = req.body.newItem;
    if(todoList.includes(currentItem) == false) {
        res.json({ success: false, message: 'Item could not be found in the list.'});
    }
    else {
        todoList = todoList.filter(element => element !== currentItem)
        res.json({ success: true, message: 'Item deleted successfully.'})
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
