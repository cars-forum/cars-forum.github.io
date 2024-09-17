import { html } from "@lit/lit-html.js";
import { FormLocker, submitHandler } from "../utils/submitUtil.js";
import { signInService } from "../service/userService.js";
import { ErrorNotific, SuccessNotific } from "../utils/notificationUtil.js";

const template = (registerHandler) => html`
<section id="register">
    <h1>Register</h1>
    <form id="register-form" @submit=${registerHandler}>
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
    const sectionId = 'register';

    async function onRegister({ username, email, password, repassword }, form) {
        const locker = new FormLocker('register-form');

        locker.lockForm();

        if (username.length < 4 || email.length < 6 || password.length < 5) {
            locker.unlockForm();
            return new ErrorNotific('Please fulfill the requirements!').showNotificIn(sectionId);
        }

        if (password !== repassword) {
            locker.unlockForm();
            return new ErrorNotific("Passwords don't match.").showNotificIn(sectionId);
        }

        try {
            await signInService.register(username, email, password);

        } catch (error) {
            locker.unlockForm();
            return new ErrorNotific(error).showNotificIn(sectionId);
        }

        form.reset();
        ctx.updateNav();
        ctx.redirect('/');
        setTimeout(()=> new SuccessNotific('You have successfully registered.').showNotificIn('home'), 3000);
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
