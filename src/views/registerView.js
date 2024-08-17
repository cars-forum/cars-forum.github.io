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
    unlockForm();

    async function onRegister({ username, email, password, repassword }, form) {
        lockForm();

        if (!username || !email || !password) {
            unlockForm();
            return alert('All fields are required.');
        }

        if(password !== repassword){
            unlockForm();
            return alert("Passwords don't match.");
        }

        try {
            await userService.register(username, email, password);

        } catch (error) {
            unlockForm();
            return;
        }

        form.reset();
        ctx.updateNav();
        ctx.redirect('/');
    }

    function unlockForm() {
        ctx.render(template(submitHandler(onRegister)));
    }

    function lockForm() {
        ctx.render(disabledFormTemplate());
    }
}