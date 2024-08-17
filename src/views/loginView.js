import { html } from "@lit/lit-html.js";
import { submitHandler } from "../utils/submitUtil.js";
import { userService } from "../service/userService.js";

const template = (loginHandler) => html`
<section id="login">
    <h1>Login</h1>
    <form @submit=${loginHandler}>
        <label for="username">Username</label>
        <input ?disabled=${false} type="text" id="username" name="username">
        <label for="password">Password</label>
        <input ?disabled=${false} type="password" id="password" name="password">
        <button ?disabled=${false} type="submit">Login</button>
    </form>
</section>
`

const disabledFormTemplate = () => html`
<section id="login">
    <h1>Login</h1>
    <form>
        <label for="username">Username</label>
        <input ?disabled=${true} type="text" id="username" name="username">
        <label for="password">Password</label>
        <input ?disabled=${true} type="password" id="password" name="password">
        <button ?disabled=${true} type="submit">Login</button>
    </form>
</section>
`

export function showLoginView(ctx) {
    unlockForm();

    async function onLogin({username, password}, form) {
        lockForm();

        if(!username || !password){
            unlockForm();
            return alert('All fields are required.');
        }

        try {
            await userService.login(username, password);

        } catch (error) {
            unlockForm();
            return;
        }

        form.reset();
        ctx.updateNav();
        ctx.redirect('/');
    }

    function unlockForm() {
        ctx.render(template(submitHandler(onLogin)));
    }

    function lockForm() {
        ctx.render(disabledFormTemplate());
    }
}
