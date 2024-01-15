const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const DataBase = 'dataBase.txt';

const item = {
    content: '',
    isChecked: false
};

let userTodoList = [];
let userTodoListFile = '';

function hashPasswordAndAppend(username, passwordToHash) {
    const saltRounds = 10;
        bcrypt.hash(passwordToHash, saltRounds, (err, hash) => {
        if(err) {
            console.error('Error hashing password:', err);
        }
        else {
            const data = username + ':' + hash + '\n';
            appendToFile(DataBase, data);
        }
    });
}

async function comparePasswords(passwordToCheck, hashedPassword) {
    console.log('Comparing passwords');
    console.log(passwordToCheck, hashedPassword)
    try {
        const res = await bcrypt.compare(passwordToCheck, hashedPassword);
        console.log(res)
        return res;
    }
    catch (error) {
        console.error('Error comparing passwords:', error);
        return false;
    }
}

function isLoggedIn(req, res, next) {
    if(userTodoListFile === '') {
        res.status(401).json({error: 'Unauthorized: Access Denied'});
    }
    else {
        next();
    }
}

app.get('/api/CheckLogin', isLoggedIn, (req, res) => {
    res.json({success: true, message: 'Access granted'});
});

function readFromFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if(err) {
            const contentToWrite = '[\n\n]';
            data = contentToWrite;
            fs.writeFile(filePath, contentToWrite, 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error('Error creating file:', writeErr);
                }
            });
        }
        const parsedData = JSON.parse(data);
        userTodoList = parsedData;
        return parsedData;
    });
}

function writeTodoListToFile(filePath) {
    const todoListAsJson = JSON.stringify(userTodoList, null, 2);
    fs.writeFile(filePath, todoListAsJson, 'utf8', (err) => {
        if(err) {
            console.error(err);
            return;
        }
    });
}

async function searchFile(filePath, username, password, checkPasssword) {
    try {
        if(!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '');
        }
        const data = fs.readFileSync(filePath, 'utf8');

        const allUsers = data.split('\n');
        const regex = /^(.*?):(.*)$/;

        for(const currentUser of allUsers) {
            const match = currentUser.match(regex);
            if(match) {
                const currentUsername = match[1];
                const currentPassword = match[2];
                if(await comparePasswords(password, currentPassword)) {
                    console.log('Password matched');
                    return true;
                }
                else{
                    return false;
                }
                if(username === currentUsername && !checkPasssword) {
                    return true;
                }
            }
            else {
                console.error('Invalid format for username:password');
            }
        }
        return false;
    }
    catch {
        console.error('Error reading file:', err);
    }
}

function appendToFile(filePath, data) {
    if(!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
    }
    fs.appendFile(filePath, data, 'utf8', (err) => {
        if (err) {
            console.error('Error appending to file:', err);
        }
    });
}

app.get('/api/TodoList', (req, res) => {
    res.json(userTodoList);
});

function operateTodoList(req, operation) {
    if(operation == 'add') {
        const newItem = {
            ...item, 
            content: req.body.newItem, 
            isChecked: false
        };
        userTodoList.push(newItem);
        writeTodoListToFile(userTodoListFile);
        return;
    }
    const currentTodoList = req.body.list;
    const currentCheckmarkList = req.body.checkbox;
    userTodoList = [];
    for(let i = 0; i < currentTodoList.length; i++) {
        if(operation == 'delete' && currentCheckmarkList[i] == true) {
            continue;
        }
        let item = {content: currentTodoList[i], isChecked: currentCheckmarkList[i]};
        userTodoList.push(item);
    }
    writeTodoListToFile(userTodoListFile);
}

app.post('/api/LoginUser', async (req, res) => {
    let result = await searchFile(DataBase, req.body.username, req.body.password, true);
    console.log("result:", result);
    if(result) {
        userTodoListFile = req.body.username + '.txt';
        userTodoList = readFromFile(userTodoListFile);
        res.json({success: true, message: 'Logged in successfully.'});
    }
    else {
        res.json({success: false, message: 'Incorrect username/password.'});
    }
});

app.post('/api/RegisterUser', (req, res) => {
    let result = searchFile(DataBase, req.body.username, '', false);
    if(result == true) {
        res.json({success: false, message: 'Username already taken.'});
        return;
    }
    const password = req.body.password;
    if(password.length < 8) {
        res.json({success: false, message: 'Password must be of atleast 8 characters.'});
        return;
    }
    let number = false, special = false, capital = false;
    req.body.password.split('').forEach(function(currentCharacter) {
        if(currentCharacter >= '0' && currentCharacter <= '9') {
            number = true;
        }
        else if(currentCharacter >= 'A' && currentCharacter <= 'Z') {
            capital = true;
        }
        else if(currentCharacter < 'a' || currentCharacter > 'z') {
            special = true;
        }
    });
    if(number == false) {
        res.json({success: false, message: 'Password must contain a number.'});
        return;
    }
    if(capital == false) {
        res.json({success: false, message: 'Password must contain a capital letter.'});
        return;
    }
    if(special == false) {
        res.json({success: false, message: 'Password must contain a special character.'});
        return;
    }
    hashPasswordAndAppend(req.body.username, req.body.password);
    res.json({success: true, message: 'Username added. Please login.'});
});

app.post('/api/AddItem', (req, res) => {
    operateTodoList(req, 'add');
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

app.post('/api/LogoutUser', (req, res) => {
    userTodoList = [];
    userTodoListFile = '';
    res.json({success: true, message: 'User logged out.'});
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});