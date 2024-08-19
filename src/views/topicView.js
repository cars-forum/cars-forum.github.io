import { html } from "@lit/lit-html.js";
import { dataService } from "../service/dataService.js";

const template = (data, replies, userData, isAdmin, handlers) => {
    const commentTemplate = (item) => html`
    <div class="comment">
        <div class="user-info">
            <img src="/static/img/avatar.png" alt="User Avatar">
            <p>${item.author.username}</p>
            <p>Additional Info</p>
        </div>
        <div class="user-comment">
            <p>Replied at: ${new Date(item.createdAt).toLocaleString('uk-Uk')}</p>
            <p>${item.content}</p>
            ${isAdmin ? html`
                <a href="/edit-reply/${item.objectId}" class="button">Edit</a>
            `: null}
        </div>
    </div>
`
    return html`
    <section id="topic">
    ${isAdmin ? html`
    <div class="admin-panel">
        ${data.isLocked ? html`
            <a @click=${handlers.unlockTopic} data-id="${data.objectId}" href="javascript:void(0)" class="button">Unlock</a>
        `: html`
            <a @click=${handlers.lockTopic} data-id="${data.objectId}" href="javascript:void(0)" class="button">Lock</a>
        `}
        <a href="javascript:void(0)" class="button">Archive</a>
    </div>
    `: null}
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
            ${isAdmin ? html`
                <a href="/edit-topic/${data.objectId}" class="button">Edit</a>
            `: null}
        </div>
    </div>
    ${replies.map(commentTemplate)}
    ${userData ? data.isLocked ? html`
        <a class="lockedButton" href="javascript:void(0)"><img src="/static/img/lock.png"></a>
    `: html`
        <a class="button" href="/reply/${data.objectId}">Reply</a>
    `: null}
</section>
`
}

export async function showTopicView(ctx) {
    const id = ctx.params.id;
    const data = await dataService.getTopicDetails(id);
    const replies = await dataService.getAllReplies(id);
    const userData = ctx.userUtils.getUserData();
    const isAdmin = ctx.userUtils.isAdmin();
    const handlers = {
        lockTopic,
        unlockTopic
    };

    ctx.render(template(data, replies, userData, isAdmin, handlers));

    async function lockTopic(e) {
        const confirmation = confirm('Do you want to lock this topic?');

        if(!confirmation){
            return;
        }

        const currentTarget = e.currentTarget;
        const postId = currentTarget.getAttribute('data-id');
        await dataService.changeTopicLockingState(postId, true);
        ctx.redirect('/topic/' + id);
    }

    async function unlockTopic(e) {
        const confirmation = confirm('Do you want to unlock this topic?');

        if(!confirmation){
            return;
        }

        const currentTarget = e.currentTarget;
        const postId = currentTarget.getAttribute('data-id');
        await dataService.changeTopicLockingState(postId, false);
        ctx.redirect('/topic/' + id);
    }
}
