import { html } from '@lit/lit-html.js';
import { styleMap } from '@lit/directives/style-map.js';
import { userService } from '../service/userService.js';
import { roleStyles } from '../utils/stylesUtils.js';
import { profileFormTemplates } from '../templates/profileTemplates.js';

const template = (data, userData, roles) => {
    const roleStyle = roleStyles[data["role"]["objectId"]];
    const isOwner = data.objectId === userData?.objectId;
return html`
<section id="user-details">
    <h1>Profile Details</h1>
    <div class="user-info">
        ${data.avatar === 'avatar.png' ? html`
            <img src="/static/img/${data.avatar}" alt="User Avatar" id="avatar-img">
        `: html`
            <img src="${data.avatar}" alt="User Avatar" id="avatar-img">
        `}
        <p>Username: <span id="username">${data.username}</span></p>
        <p>Email: <span id="email">${data.email}</span></p>
        <p>Registered on: <span id="registered-on">${new Date(data.createdAt).toLocaleDateString('uk-Uk')}</span></p> 
        ${data.location ? html`
            <p>Location: <span id="location">${data.location}</span></p>
        `: null}
        <p><span style=${styleMap(roleStyle)} id="role-info">${data.role.name}</span></p>
    </div>
    ${isOwner || roles.isAdmin || roles.isModerator ? html`
        <form>
            ${profileFormTemplates[userData.roleId](data)}
            <button type="submit" class="update-button">Update</button>
        </form>
    ` : null}
    
</section>
`}

export async function showProfileView(ctx) {
    const userId = ctx.params.id;
    const data = await userService.getUserInfo(userId);
    const userData = ctx.userUtils.getUserData();
    const roles = {
        isAdmin: ctx.userUtils.isAdmin(),
        isModerator: ctx.userUtils.isModerator(),
        isTopUser: ctx.userUtils.isTopUser()
    };

    ctx.render(template(data, userData, roles));
}