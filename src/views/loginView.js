import { html } from "@lit/lit-html.js";
import { FormLocker, submitHandler } from "../utils/submitUtil.js";
import { signInService } from "../service/userService.js";
import { ErrorNotific, SuccessNotific } from '../utils/notificationUtil.js';

const template = (loginHandler) => html`
                    <section id="notific"></section>
                    <form @submit=${loginHandler} id="login-form">
                        <h2>Login</h2>
                        <p class="field">
                            <label for="username">Username:</label>
                            <input type="text" name="username" id="username">
                        </p>

                        <p class="field">
                            <label for="password">Password:</label>
                            <input type="password" name="password" id="password">
                        </p>

                        <p class="italic">You don't have an account? <a class="cf-link" href="/login">Register here.</a></p>

                        <button class="button">Login</button>
                    </form>
`
export function showLoginView(ctx) {
    ctx.render(ctx.heads.formHeadTemplate(), document.querySelector("head"));
    ctx.render(template(submitHandler(onLogin)));
    const sectionId = 'notific';

    async function onLogin({ username, password }, form) {
        const locker = new FormLocker('login-form');
        locker.lockForm();

        if (!username || !password) {
            locker.unlockForm();
            return new ErrorNotific('All fields are required.').showNotificIn(sectionId);
        }

        try {
            await signInService.login(username, password);

        } catch (error) {
            locker.unlockForm();
            return new ErrorNotific(error).showNotificIn(sectionId);
        }

        form.reset();
        ctx.updateNav();
        ctx.redirect('/');
        // setTimeout(()=> new SuccessNotific('You have successfully logged in.').showNotificIn('home'), 3000);
    }
}