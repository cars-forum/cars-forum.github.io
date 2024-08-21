import { html } from '@lit/lit-html.js';
import { userService } from '../service/userService.js';

const template = (data, userData, roles) => html`
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
        <p><span id="role-info">${data.role.name}</span></p>
    </div>
    ${userData ? html`
        <form>
            ${roles.isAdmin ? formAdmin() : 
                roles.isModerator ? formModerator() :
                roles.isTopUser ? formTopUser() : formUser()}
        </form>
    ` : null}
    
</section>
`

const formUser = () => html`
        <!-- Avatar URL Field -->
        <label for="avatar-url">Avatar URL</label>
        <input type="text" id="avatar-url" name="avatar-url" placeholder="Enter new avatar URL">

        <!-- Location Field -->
        <label for="location">Location</label>
        <input type="text" id="location" name="location" placeholder="Enter location">

        <!-- Submit Button -->
        <button type="submit" class="update-button">Update</button>
`
const formTopUser = () => html`
        <!-- Avatar URL Field -->
        <label for="avatar-url">Avatar URL</label>
        <input type="text" id="avatar-url" name="avatar-url" placeholder="Enter new avatar URL">

        <!-- Location Field -->
        <label for="location">Location</label>
        <input type="text" id="location" name="location" placeholder="Enter location">

        <!-- Preferred Manufacturer Field -->
        <label for="preferred-manufacturer">Preferred Manufacturer</label>
        <select id="preferred-manufacturer" name="preferred-manufacturer">
            <option value="toyota">Toyota</option>
            <option value="honda">Honda</option>
            <option value="bmw">BMW</option>
            <option value="mercedes">Mercedes</option>
            <option value="ford">Ford</option>
            <option value="chevrolet">Chevrolet</option>
        </select>

        <!-- Submit Button -->
        <button type="submit" class="update-button">Update</button>
`
const formModerator = () => html`
        <!-- Avatar URL Field -->
        <label for="avatar-url">Avatar URL</label>
        <input type="text" id="avatar-url" name="avatar-url" placeholder="Enter new avatar URL">

        <!-- Location Field -->
        <label for="location">Location</label>
        <input type="text" id="location" name="location" placeholder="Enter location">

        <!-- Preferred Manufacturer Field -->
        <label for="preferred-manufacturer">Preferred Manufacturer</label>
        <select id="preferred-manufacturer" name="preferred-manufacturer">
            <option value="toyota">Toyota</option>
            <option value="honda">Honda</option>
            <option value="bmw">BMW</option>
            <option value="mercedes">Mercedes</option>
            <option value="ford">Ford</option>
            <option value="chevrolet">Chevrolet</option>
        </select>

        <!-- Ban Until Date and Time Picker -->
        <div class="ban-until">
            <label for="ban-until">Ban Until</label>
            <input disabled type="datetime-local" id="ban-until" name="ban-until">
            <input type="checkbox" id="ban-checkbox" name="ban-checkbox">
        </div>

        <!-- Submit Button -->
        <button type="submit" class="update-button">Update</button>
`
const formAdmin = () => html`
        <!-- Avatar URL Field -->
        <label for="avatar-url">Avatar URL</label>
        <input type="text" id="avatar-url" name="avatar-url" placeholder="Enter new avatar URL">

        <!-- Location Field -->
        <label for="location">Location</label>
        <input type="text" id="location" name="location" placeholder="Enter location">

        <!-- Preferred Manufacturer Field -->
        <label for="preferred-manufacturer">Preferred Manufacturer</label>
        <select id="preferred-manufacturer" name="preferred-manufacturer">
            <option value="toyota">Toyota</option>
            <option value="honda">Honda</option>
            <option value="bmw">BMW</option>
            <option value="mercedes">Mercedes</option>
            <option value="ford">Ford</option>
            <option value="chevrolet">Chevrolet</option>
        </select>

        <!-- Role Selection Field -->
        <label for="role">Role</label>
        <select id="role" name="role">
            <option value="member">Member</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
        </select>

        <!-- Ban Until Date and Time Picker -->
        <div class="ban-until">
            <label for="ban-until">Ban Until</label>
            <input disabled type="datetime-local" id="ban-until" name="ban-until">
            <input type="checkbox" id="ban-checkbox" name="ban-checkbox">
        </div>

        <!-- Submit Button -->
        <button type="submit" class="update-button">Update</button>
`

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