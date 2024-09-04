import { html } from "@lit/lit-html.js";
import { FormLocker, submitHandler } from "../utils/submitUtil.js";
import { signInService } from "../service/userService.js";

const template = (registerHandler) => html`
<section id="register">
    <h1>Register</h1>
    <form @submit=${registerHandler}>
        <label for="username">Username</label>
        <input @change=${fillCheck} type="text" id="username" name="username">
        <label for="email">Email</label>
        <input @change=${fillCheck} type="text" id="email" name="email">
        <label for="password">Password</label>
        <input @change=${fillCheck} type="password" id="password" name="password">
        <label for="repassword">Repeat Password</label>
        <input @change=${passwordMatchingCheck} type="password" id="repassword" name="repassword">
        <button id="submit" type="submit">Register</button>
    </form>
</section>
`

export function showRegisterView(ctx) {
    ctx.render(template(submitHandler(onRegister)));

    async function onRegister({ username, email, password, repassword }, form) {
        const locker = new FormLocker(['username', 'email', 'password', 'repassword', 'submit']);

        locker.lockForm();

        if (username.length < 4 || email.length < 6 || password.length < 5) {
            locker.unlockForm();
            return alert('Please fulfill the requirements!');
        }

        if (password !== repassword) {
            locker.unlockForm();
            return alert("Passwords don't match.");
        }

        try {
            await signInService.register(username, email, password);

        } catch (error) {
            locker.unlockForm();
            return;
        }

        form.reset();
        ctx.updateNav();
        ctx.redirect('/');
    }

}

function fillCheck(e) {
    const currentTarget = e.currentTarget;
    const name = currentTarget.getAttribute('name');
    const fieldsLength = {
        username: 4,
        email: 6,
        password: 5
    };

    const minLength = fieldsLength[name];

    const currentLength = currentTarget.value.length;

    const labelRef = document.querySelector(`label[for="${name}"]`);

    currentLength < minLength ? invalidStylization() : validStylization();


    function validStylization() {
        currentTarget.classList.remove('invalid');
        labelRef.textContent = name[0].toUpperCase() + name.slice(1);
        labelRef.style.color = 'black';
    }

    function invalidStylization() {
        currentTarget.classList.add('invalid');
        labelRef.textContent += ` must be at least ${fieldsLength[name]} characters long.`;
        labelRef.style.color = 'red';
    }
}

function passwordMatchingCheck(e) {
    const currentTarget = e.currentTarget;
    const value = currentTarget.value;
    const name = currentTarget.getAttribute('name');
    const labelRef = document.querySelector(`label[for="${name}"]`);

    value !== document.getElementById('password').value ? invalidStylization() : validStylization();

    function validStylization() {
        currentTarget.classList.remove('invalid');
        labelRef.textContent = name[0].toUpperCase() + name.slice(1);
        labelRef.style.color = 'black';
    }

    function invalidStylization() {
        currentTarget.classList.add('invalid');
        labelRef.textContent = "Passwords don't match.";
        labelRef.style.color = 'red';
    }
}
