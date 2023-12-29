document.addEventListener('DOMContentLoaded', function() {
    var loginFormId = document.getElementById('loginForm');
    var registerFormId = document.getElementById('registerForm');
    var switchFormId = document.querySelector('.switch');

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

    function loginForm() {
        console.log('coming to login form');
        
    }

    function registerForm() {
        console.log('coming to register form');
    }

    function switchForm() {
        loginFormId.style.display = loginFormId.style.display === 'block' ? 'none' : 'block';
        registerFormId.style.display = registerFormId.style.display === 'block' ? 'none' : 'block';

        var content = document.querySelector('.switch p').innerHTML;
        if(loginFormId.style.display === 'none') {
            content = "Already have an account? <a href='#' id='switchForm'>Login</a>";
        }
        else {
            content = "Don't have an account? <a href='#' id='switchForm'>Register</a>";
        }
        document.querySelector('.switch p').innerHTML = content;
    }
});