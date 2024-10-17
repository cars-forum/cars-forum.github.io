import { html, render } from '@lit/lit-html.js';
import { user } from '../utils/userUtils.js';
import { signInService } from '../service/userService.js';
import page from '@page/page.mjs';
import { heads } from '../templates/headTemplates.js';
import { SuccessNotific } from '../utils/notificationUtil.js';

export function addNavControl() {
    return function (ctx, next) {
        ctx.updateNav = updateNav;
        ctx.heads = heads;
        next();
    }
}

export function updateNav() {
    const template = (userData) => html`
    <ul>
    <li><a id="homeButton" href="/" class="button"><i class="fa-solid fa-house"></i></a></li>
    
        ${userData ? html`
            <li><a id="profileButton" href="/profile/${userData.objectId}" class="button"><i class="fa-solid fa-user"></i></a></li>
            <li><a @click=${onLogout} id="logoutButton" href="javascript:void(0)" class="button"><i class="fa-solid fa-right-from-bracket"></i></a></li>
        `: html`
            <li><a id="loginButton" href="/login" class="button"><i class="fa-solid fa-right-to-bracket"></i></a></li>
            <li><a id="registerButton" href="/register" class="button"><i class="fa-solid fa-user-plus"></i></a></li>
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
    setTimeout(() => new SuccessNotific('You have successfully logged out.').showNotificIn('home'), 3000);
}