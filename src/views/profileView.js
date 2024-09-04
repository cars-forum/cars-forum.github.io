import { html } from '@lit/lit-html.js';
import { styleMap } from '@lit/directives/style-map.js';
import { roleService, userService, banService } from '../service/userService.js';
import { roleStyles } from '../utils/stylesUtils.js';
import { profileFormTemplates } from '../templates/profileTemplates.js';
import { replyService, commonDataService } from '../service/dataService.js';
import { FormLocker, submitHandler } from '../utils/submitUtil.js';

const template = (data, userData, roles, brands, isBanned, updateHandler, banHandler) => {
    const roleStyle = roleStyles[data["role"]["objectId"]];
    const brandStyle = { width: "60px", height: "60px" };
    const isOwner = data.objectId === userData?.objectId;
    return html`
<section id="user-details">
    <h1>Profile Details</h1>
    <div class="user-info">
        ${data.avatar === 'avatar.png' || data.avatar === 'admin-avatar.png' ? html`
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
    ${!isBanned ? html`
    ${isOwner || roles.isAdmin || roles.isModerator ? html`
            <form @submit=${updateHandler}>
                ${profileFormTemplates[userData.roleId](data, brands)}
                <br />
                <button id="submit" type="submit" class="update-button">Update</button>
            </form>
        ` : null}

    `: null}

    
    ${roles.isAdmin || roles.isModerator ? html`
        <label for="ban-section"><input @change=${showAndHideBanMenu} type="checkbox" id="ban-section" name="ban-section">Show Ban Manu</label>
        <form id="ban-form" @submit=${banHandler} style="display:none">
            <div class="ban-user">
                <h2>Ban User</h2>
                <label for="expiresOn">Expires At</label>
                <input type="datetime-local" id="expiresOn" name="expiresOn">
                <input type="text" id="reason" name="reason">
                <label for="reason">Reason</label>
                <button id="banSubmit" type="submit" class="update-button">Update</button>
            </div>
        </form>
    `: null}
    
</section>
`}

export async function showProfileView(ctx) {
    const userId = ctx.params.id;
    const data = await userService.getUserInfo(userId);
    const repliesCount = await commonDataService.getUserRepliesCount(data.objectId);
    data.repliesCount = repliesCount;
    const userData = ctx.userUtils.getUserData();

    const roles = {
        isAdmin: ctx.userUtils.isAdmin(),
        isModerator: ctx.userUtils.isModerator(),
        isTopUser: ctx.userUtils.isTopUser()
    };

    let brands = null;
    if (Object.values(roles).some(val => val === true)) {
        brands = await commonDataService.getAllBrands();
    }

    const isBanned = await banService.isActiveBan(userId) && userData.objectId === userId;

    ctx.render(template(data, userData, roles, brands, isBanned, submitHandler(onUpdate), submitHandler(onBan)));
    const locker = new FormLocker(['avatar-url',
        'location',
        'preferred-manufacturer',
        'ban-until',
        'role',
        'submit']);

    async function onUpdate({ "avatar-url": avatar, location, "preferred-manufacturer": preferredManufacturer, role }) {
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

    async function onBan({ expiresOn, reason }) {
        locker.lockForm();

        if (!expiresOn) {
            locker.unlockForm();
            return alert('Please, pick a date!');
        }

        expiresOn = new Date(expiresOn);

        const today = new Date();

        if (today >= expiresOn) {
            locker.unlockForm();
            return alert("You can't choose dates in the past.");
        }

        const bansReportsTopicId = 'ra3dDlNpkj';
        const modId = userData.objectId;
        const username = data.username;
        const message = `${username} has been banned from the forum. The ban expires at ${expiresOn.toLocaleString('uk-Uk')}.\nReason: ${reason}`;

        try {
            await banService.banUser(userId, expiresOn, reason);
            await replyService.addNewReply(message, modId, bansReportsTopicId);
        } catch (error) {
            locker.unlockForm();
            return;
        }

        ctx.redirect('/topic/' + bansReportsTopicId);
    }
}

function showAndHideBanMenu(e) {
    const banForm = document.getElementById('ban-form');

    if (e.currentTarget.checked) {
        banForm.style.display = 'block';
        return;
    }

    banForm.style.display = 'none';
}