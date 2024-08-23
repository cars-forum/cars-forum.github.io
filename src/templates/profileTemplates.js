import { html } from "@lit/lit-html.js";
import { ROLES } from "../service/roles.js";

const userKey = ROLES.user;
const topUserKey = ROLES.topUser;
const moderatorKey = ROLES.moderator;
const adminKey = ROLES.admin;

const formUser = (data) => html`
        <!-- Avatar URL Field -->
        <label for="avatar-url">Avatar URL</label>
        <input type="text" id="avatar-url" name="avatar-url" placeholder="Enter new avatar URL" .value=${data.avatar}>

        <!-- Location Field -->
        <label for="location">Location</label>
        ${data.location ? html`
            <input type="text" id="location" name="location" placeholder="Enter location" .value=${data.location}>
        `: html`
            <input type="text" id="location" name="location" placeholder="Enter location">
        `} 
`
const formTopUser = (data, brands) => html`
        ${formUser(data)}

        <!-- Preferred Manufacturer Field -->
        <label for="preferred-manufacturer">Preferred Manufacturer</label>
        <select id="preferred-manufacturer" name="preferred-manufacturer">
            <option value="none"></option>
            ${brands.map(brand => html`
                <optgroup label="${brand.country}">
                    ${Object.entries(brand.brandsList).map(pair => html`<option value="${pair[1]}">${pair[0]}</option>`)}
                </optgroup>
            `)}
        </select>
`
const formModerator = (data, brands) => html`
        ${formTopUser(data, brands)}

        <!-- Ban Until Date and Time Picker -->
        <div class="ban-until">
            <label for="ban-until">Ban Until</label>
            <input disabled type="datetime-local" id="ban-until" name="ban-until">
            <input type="checkbox" id="ban-checkbox" name="ban-checkbox">
        </div>
`
const formAdmin = (data, brands) => html`
        ${formModerator(data, brands)}

        <!-- Role Selection Field -->
        <label for="role">Role</label>
        <select id="role" name="role">
            <option value="member">Member</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
        </select>
`

const profileFormTemplates = {}
profileFormTemplates[userKey] = formUser;
profileFormTemplates[topUserKey] = formTopUser;
profileFormTemplates[moderatorKey] = formModerator;
profileFormTemplates[adminKey] = formAdmin;

export { profileFormTemplates };