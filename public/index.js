document.addEventListener('DOMContentLoaded', function() {
    let loginFormId = document.getElementById('loginForm');
    let registerFormId = document.getElementById('registerForm');
    let switchFormId = document.querySelector('.switch');

    let errorMessageShown = false;

    loginFormId.addEventListener('submit', function(event) {
        event.preventDefault();
        loginForm();
    });

    registerFormId.addEventListener('submit', function(event) {
        event.preventDefault();
        registerForm();
    });

    switchFormId.addEventListener('click', function(event) {
        if(event.target.id === 'switchForm') {
            event.preventDefault();
            switchForm();
        }
    })

    function showLoginErrorMessage(message) {
        if(errorMessageShown === true) return;
        let errorDiv = document.getElementById('invalid-username');
        errorDiv.style.display = 'block';
    }

    function loginForm() {
        let loginFormUsername = document.getElementById('login-username').value;
        let loginFormPassword = document.getElementById('login-password').value;

        if(loginFormUsername !== '' && loginFormPassword !== '') {
            fetch('/api/LoginUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: loginFormUsername, password: loginFormPassword}),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        if(errorMessageShown) {
                            let errorDiv = document.getElementById('invalid-username');
                            errorDiv.style.display = 'none';
                        }
                        errorMessageShown = false;
                        window.location.href = 'todolist.html';
                    } else {
                        showLoginErrorMessage(data.message);
                        errorMessageShown = true;
                    }
                })
                .catch(error => console.error(error));
        }
    }

    function registerForm() {
        let registerFormUsername = document.getElementById('register-username').value;
        let registerFormPassword = document.getElementById('register-password').value;


        if(registerFormUsername !== '' && registerFormPassword !== '') {
            fetch('/api/RegisterUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: registerFormUsername, password: registerFormPassword}),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        document.getElementById('registerForm').reset();
                        switchForm();
                    } else {
                        console.log('Failed to register user:', data.message);
                    }
                })
                .catch(error => console.error(error));
        }
    }

    function switchForm() {
        loginFormId.style.display = loginFormId.style.display === 'block' ? 'none' : 'block';
        registerFormId.style.display = registerFormId.style.display === 'block' ? 'none' : 'block';

        if(errorMessageShown) {
            errorMessageShown = false;
            let errorDiv = document.getElementById('invalid-username');
            errorDiv.style.display = 'none';
        }

        let content = document.querySelector('.switch p').innerHTML;
        if(loginFormId.style.display === 'none') {
            content = "Already have an account? <a href='#' id='switchForm'>Login</a>";
        }
        else {
            content = "Don't have an account? <a href='#' id='switchForm'>Register</a>";
        }
        document.querySelector('.switch p').innerHTML = content;
    }
});