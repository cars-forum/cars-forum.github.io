import { html, render } from '@lit/lit-html.js';
import { user } from '../utils/userUtils.js';
import { signInService } from '../service/userService.js';
import page from '@page/page.mjs';
import { SuccessNotific } from '../utils/notificationUtil.js';

export function addNavControl() {
    return function (ctx, next) {
        ctx.updateNav = updateNav;

        next();
    }
}

export function updateNav() {
    const template = (userData) => html`
    <ul>
        <li><a href="/">Home</a></li>
    
        ${userData ? html`
            <li><a href="/profile/${userData.objectId}">Profile: ${userData.username}</a></li>
            <li><a @click=${onLogout} href="javascript:void(0)">Logout</a></li>
        `: html`
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
        `}
    </ul>
        `

    const userData = user.getUserData();
    const nav = document.querySelector('nav');
    render(template(userData), nav);
}

async function onLogout() {
    try {
        await signInService.logout();

    } catch (error) {
        return;
    }
    
    updateNav();
    page.redirect('/');
    setTimeout(()=> new SuccessNotific('You have successfully logged out.').showNotificIn('home'), 3000);
}