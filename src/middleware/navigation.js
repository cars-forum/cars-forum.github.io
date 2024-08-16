import { html, render } from '@lit/lit-html.js';
import { user } from '../utils/userUtils';

export function addNavControl(params) {
    return function(ctx, next) {
        ctx.updateNav = updateNav;

        next();
    }

    function updateNav() {
        const template = (userData) => html`
        <ul>
            <li><a href="home.html">Home</a></li>
        
            ${userData ? html`
                <li><a href="profile.html">Profile: ${userData.username}</a></li>
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
}