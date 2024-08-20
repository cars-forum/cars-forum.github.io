import { html } from '@lit/lit-html.js';

const template = () => html`
<section id="user-details">
    <h1>Profile Details</h1>
    <div class="user-info">
        <img src="/static/img/avatar.png" alt="User Avatar" id="avatar-img">
        <p>Username: <span id="username">JohnDoe</span></p>
    </div>

    <form>
        <!-- Avatar URL Field -->
        <label for="avatar-url">Avatar URL</label>
        <input type="text" id="avatar-url" name="avatar-url" placeholder="Enter new avatar URL">

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
        <button type="submit" class="update-button">Update User Details</button>
    </form>
</section>
`

export async function showProfileView(ctx) {
    ctx.render(template());
}