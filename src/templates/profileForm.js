import { html } from "@lit/lit-html.js";
import { ROLES } from "../service/roles.js";

const userKey = ROLES.user;
const topUserKey = ROLES.topUser;
const moderatorKey = ROLES.moderator;
const adminKey = ROLES.admin;

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

const profileFormTemplates = {}
profileFormTemplates[userKey] = formUser;
profileFormTemplates[topUserKey] = formTopUser;
profileFormTemplates[moderatorKey] = formModerator;
profileFormTemplates[adminKey] = formAdmin;

export { profileFormTemplates };