import { html } from "@lit/lit-html.js";
import { dataService } from "../service/dataService.js";

const template = (data, userData) => html`
    <section id="topic">
    <h1>${data.title}</h1>
    <div class="comment">
        <div class="user-info">
            <img src="/static/img/avatar.png" alt="User Avatar">
            <p>${data.author.username}</p>
            <p>Additional Info</p>
        </div>
        <div class="user-comment">
            <p>Published at: ${new Date(data.createdAt).toLocaleString('uk-Uk')}</p>
            <p>${data.content}</p>
        </div>
    </div>
    <!-- <div class="comment">
        <div class="user-info">
            <img src="static/img/avatar.png" alt="User Avatar">
            <p>Username</p>
            <p>Additional Info</p>
        </div>
        <div class="user-comment">
            <p>This is another user comment on the topic.</p>
        </div>
    </div> -->
    ${userData ? html`
        <a class="button" href="/reply/${data.objectId}">Reply</a>
    `: null}
</section>
`

export async function showTopicView(ctx) {
    const id = ctx.params.id;
    const data = await dataService.getTopicDetails(id);
    const userData = ctx.userUtils.getUserData();
    ctx.render(template(data, userData));
}