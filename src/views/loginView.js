import { html } from "@lit/lit-html.js";
import { FormLocker, submitHandler } from "../utils/submitUtil.js";
import { signInService } from "../service/userService.js";
import { ErrorNotific, SuccessNotific } from '../utils/notificationUtil.js';

const template = (loginHandler) => html`
<section id="login">
    <h1>Login</h1>
    <form id='login-form' @submit=${loginHandler}>
        <label for="username">Username</label>
        <input type="text" id="username" name="username">
        <label for="password">Password</label>
        <input type="password" id="password" name="password">
        <button id="submit" type="submit">Login</button>
    </form>
</section>
`
export function showLoginView(ctx) {
    ctx.render(template(submitHandler(onLogin)));
    const sectionId = 'login';

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
    }
}