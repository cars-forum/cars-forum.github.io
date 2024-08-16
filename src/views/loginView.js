import { html } from "@lit/lit-html.js";
import { submitHandler } from "../utils/submitUtil.js";
import { userService } from "../service/userService.js";

const template = (loginHandler) => html`
<section id="login">
    <h1>Login</h1>
    <form @submit=${loginHandler}>
        <label for="username">Username</label>
        <input type="text" id="username" name="username">
        <label for="password">Password</label>
        <input type="password" id="password" name="password">
        <button type="submit">Login</button>
    </form>
</section>
`

const disabledFormTemplate = () => html`
<section id="login">
    <h1>Login</h1>
    <form>
        <label ?disabled=${true} for="username">Username</label>
        <input type="text" id="username" name="username">
        <label ?disabled=${true} for="password">Password</label>
        <input type="password" id="password" name="password">
        <button ?disabled=${true} type="submit">Login</button>
    </form>
</section>
`
// TODO: Login handler doesn't work after unsuccessful submit.
export function showLoginView(ctx) {
    ctx.render(template(submitHandler(onLogin)));

    async function onLogin({username, password}, form) {
        ctx.render(disabledFormTemplate());

        if(!username || !password){
            ctx.render(template(submitHandler(onLogin)));
            return alert('All fields are required.');
        }

        try {
            await userService.login(username, password);

        } catch (error) {
            return;
        }

        form.reset();
        ctx.updateNav();
        ctx.redirect('/');
    }
}
