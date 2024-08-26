import { html } from '@lit/lit-html.js';
import { styleMap } from '@lit/directives/style-map.js';
import { roleService, userService } from '../service/userService.js';
import { roleStyles } from '../utils/stylesUtils.js';
import { profileFormTemplates } from '../templates/profileTemplates.js';
import { dataService } from '../service/dataService.js';
import { FormLocker, submitHandler } from '../utils/submitUtil.js';

const template = (data, userData, roles, brands, updateHandler) => {
    const roleStyle = roleStyles[data["role"]["objectId"]];
    const brandStyle = { width: "60px", height: "60px" };
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
        <p>Replies: <span id="replies">${data.repliesCount}</span></p>
        <p>Email: <span id="email">${data.email}</span></p>
        <p>Registered on: <span id="registered-on">${new Date(data.createdAt).toLocaleDateString('uk-Uk')}</span></p> 
        ${data.location ? html`
            <p>Location: <span id="location">${data.location}</span></p>
        `: null}
        ${data.preferredManufacturer ? html`<p>Prefers: <br /> <img style=${styleMap(brandStyle)} src="${data.preferredManufacturer}"></p>` : null}
        <p><span style=${styleMap(roleStyle)} id="role-info">${data.role.name}</span></p>
    </div>
    ${isOwner || roles.isAdmin || roles.isModerator ? html`
        <form @submit=${updateHandler}>
            ${profileFormTemplates[userData.roleId](data, brands)}
            <button id="submit" type="submit" class="update-button">Update</button>
        </form>
    ` : null}
    
</section>
`}

export async function showProfileView(ctx) {
    const userId = ctx.params.id;
    const data = await userService.getUserInfo(userId);
    const repliesCount = await dataService.getUserRepliesCount(data.objectId);
    data.repliesCount = repliesCount;
    const userData = ctx.userUtils.getUserData();
    const roles = {
        isAdmin: ctx.userUtils.isAdmin(),
        isModerator: ctx.userUtils.isModerator(),
        isTopUser: ctx.userUtils.isTopUser()
    };

    let brands = null;
    if (Object.values(roles).some(val => val === true)) {
        brands = await dataService.getAllBrands();
    }

    ctx.render(template(data, userData, roles, brands, submitHandler(onUpdate)));

    async function onUpdate({ "avatar-url": avatar, location, "preferred-manufacturer": preferredManufacturer, role }) {
        debugger;
        const locker = new FormLocker(['avatar-url',
            'location',
            'preferred-manufacturer',
            'ban-until',
            'role',
            'submit']);
        locker.lockForm();
        const updateData = {};

        if (avatar && avatar !== data?.avatar) {
            updateData.avatar = avatar;
        }

        if (location && location !== data?.location) {
            updateData.location = location;
        }

        if (preferredManufacturer && preferredManufacturer !== 'none') {
            updateData.preferredManufacturer = preferredManufacturer;
        }

        try {

            if (updateData && Object.values(updateData).length) {
                await userService.updateUserInfo(userId, updateData);
            }

            if (role && role !== 'none') {
                await roleService[role](data.objectId);
            }

        } catch (error) {
            locker.unlockForm();
            return;
        }
        locker.unlockForm();
        ctx.redirect('/profile/' + userId);
    }
}