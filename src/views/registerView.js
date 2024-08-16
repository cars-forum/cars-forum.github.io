import { html } from "@lit/lit-html.js";
import { submitHandler } from "../utils/submitUtil.js";
import { userService } from "../service/userService.js";

const template = (registerHandler) => html`
<section id="register">
    <h1>Register</h1>
    <form @submit=${registerHandler}>
        <label for="username">Username</label>
        <input type="text" id="username" name="username">
        <label for="email">Email</label>
        <input type="text" id="email" name="email">
        <label for="password">Password</label>
        <input type="password" id="password" name="password">
        <label for="repassword">Repeat Password</label>
        <input type="password" id="repassword" name="repassword">
        <button type="submit">Register</button>
    </form>
</section>
`

const disabledFormTemplate = () => html`
<section id="register">
    <h1>Register</h1>
    <form>
        <label for="username">Username</label>
        <input ?disabled=${true} type="text" id="username" name="username">
        <label for="email">Email</label>
        <input ?disabled=${true} type="text" id="email" name="email">
        <label for="password">Password</label>
        <input ?disabled=${true} type="password" id="password" name="password">
        <label for="repassword">Repeat Password</label>
        <input ?disabled=${true} type="password" id="repassword" name="repassword">
        <button ?disabled=${true} type="submit">Register</button>
    </form>
</section>
`

export function showRegisterView(ctx) {
    ctx.render(template(submitHandler(onRegister)));

    async function onRegister({ username, email, password }, form) {
        ctx.render(disabledFormTemplate());

        if (!username || !email || !password) {
            ctx.render(template(submitHandler(onRegister)));
            return alert('All fields are required.');
        }

        try {
            await userService.register(username, email, password);

        } catch (error) {
            return;
        }

        form.reset();
        ctx.updateNav();
        ctx.redirect('/');
    }
}