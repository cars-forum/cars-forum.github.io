import { html } from "@lit/lit-html.js";
import { FormLocker, submitHandler } from "../utils/submitUtil.js";
import { userService } from "../service/userService.js";

const template = (loginHandler) => html`
<section id="login">
    <h1>Login</h1>
    <form @submit=${loginHandler}>
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

    async function onLogin({ username, password }, form) {
        const locker = new FormLocker(['username', 'password', 'submit']);
        locker.lockForm();

        if (!username || !password) {
            locker.unlockForm();
            return alert('All fields are required.');
        }

        try {
            await userService.login(username, password);

        } catch (error) {
            locker.unlockForm();
            return;
        }

        form.reset();
        ctx.updateNav();
        ctx.redirect('/');
    }
}