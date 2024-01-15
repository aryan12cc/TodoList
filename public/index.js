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

        let usernameUniqueDiv = document.getElementById('register-username-unique');
        let passwordLengthDiv = document.getElementById('register-password-length');
        let passwordNumberDiv = document.getElementById('register-password-number');
        let passwordCapitalDiv = document.getElementById('register-password-capital');
        let passwordSpecialDiv = document.getElementById('register-password-special');


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
                        usernameUniqueDiv.style.color = 'black';
                        passwordLengthDiv.style.color = 'black';
                        passwordNumberDiv.style.color = 'black';
                        passwordCapitalDiv.style.color = 'black';
                        passwordSpecialDiv.style.color = 'black';
                        switchForm();
                    } else {
                        usernameUniqueDiv.style.color = (!data.username_taken) ? 'black' : 'red';
                        passwordLengthDiv.style.color = (!data.length) ? 'black' : 'red';
                        passwordNumberDiv.style.color = (!data.number) ? 'black' : 'red';
                        passwordCapitalDiv.style.color = (!data.capital) ? 'black' : 'red';
                        passwordSpecialDiv.style.color = (!data.special) ? 'black': 'red';
                    }
                })
                .catch(error => console.error(error));
        }
    }

    function switchForm() {
        if(registerFormId.style.display === 'block') {
            let usernameUniqueDiv = document.getElementById('register-username-unique');
            let passwordLengthDiv = document.getElementById('register-password-length');
            let passwordNumberDiv = document.getElementById('register-password-number');
            let passwordCapitalDiv = document.getElementById('register-password-capital');
            let passwordSpecialDiv = document.getElementById('register-password-special');
            usernameUniqueDiv.style.color = 'black';
            passwordLengthDiv.style.color = 'black';
            passwordNumberDiv.style.color = 'black';
            passwordCapitalDiv.style.color = 'black';
            passwordSpecialDiv.style.color = 'black';
        }
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