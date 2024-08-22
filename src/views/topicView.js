import { html } from "@lit/lit-html.js";
import { dataService } from "../service/dataService.js";

const template = (data, replies, userData, isAdmin, isArchived, handlers) => {
    const commentTemplate = (item) => html`
    <div class="comment">
        <div class="user-info">
            <img src="/static/img/avatar.png" alt="User Avatar">
            <p><a href="/profile/${item.author.objectId}">${item.author.username}</a></p>
            <p>Additional Info</p>
        </div>
        <div class="user-comment">
            <p>Replied at: ${new Date(item.createdAt).toLocaleString('uk-Uk')}</p>
            ${item.content.map(par => html`<p>${par}</p>`)}
            ${isAdmin ? html`
                <a href="/edit-reply/${item.objectId}" class="button">Edit</a>
            `: null}
        </div>
    </div>
`
    return html`
    <section id="topic">
    ${isAdmin && !isArchived  ? html`
    <div class="admin-panel">
        ${data.isLocked ? html`
            <a @click=${handlers.unlockTopic} data-id="${data.objectId}" href="javascript:void(0)" class="button">Unlock</a>
        `: html`
            <a @click=${handlers.lockTopic} data-id="${data.objectId}" href="javascript:void(0)" class="button">Lock</a>
        `}
        <a @click=${handlers.archiveTopic} data-id="${data.objectId}" href="javascript:void(0)" class="button">Archive</a>
    </div>
    `: null}
    <h1>${data.title}</h1>
    <div class="comment">
        <div class="user-info">
            <img src="/static/img/avatar.png" alt="User Avatar">
            <p><a href="/profile/${data.author.objectId}">${data.author.username}</a></p>
            <p>Additional Info</p>
        </div>
        <div class="user-comment">
            <p>Published at: ${new Date(data.createdAt).toLocaleString('uk-Uk')}</p>
            ${data.content.map(par => html`<p>${par}</p>`)}
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
    let replies = await dataService.getAllReplies(id);
    data.content = data.content.split('\n');
    replies = replies.map(rep => {
        const result = { ...rep }
        result.content = rep.content.split('\n');
        return result;
    });
    const userData = ctx.userUtils.getUserData();
    const isAdmin = ctx.userUtils.isAdmin();
    const isArchived = data.category.objectId === "IHKYWUnBbb";
    const handlers = {
        lockTopic,
        unlockTopic,
        archiveTopic
    };

    ctx.render(template(data, replies, userData, isAdmin, isArchived, handlers));

    async function lockTopic(e) {
        const confirmation = confirm('Do you want to lock this topic?');

        if (!confirmation) {
            return;
        }

        const currentTarget = e.currentTarget;
        const postId = currentTarget.getAttribute('data-id');
        try {
            await dataService.changeTopicLockingState(postId, true);
            
        } catch (error) {
            return;
        }
        ctx.redirect('/topic/' + id);
    }

    async function unlockTopic(e) {
        const confirmation = confirm('Do you want to unlock this topic?');

        if (!confirmation) {
            return;
        }

        const currentTarget = e.currentTarget;
        const postId = currentTarget.getAttribute('data-id');
        try {
            await dataService.changeTopicLockingState(postId, false);
            
        } catch (error) {
            return;
        }
        ctx.redirect('/topic/' + id);
    }

    async function archiveTopic(e) {
        const confirmation = confirm('Do you want to archive this topic?');

        if (!confirmation) {
            return;
        }

        const currentTarget = e.currentTarget;
        const postId = currentTarget.getAttribute('data-id');

        try {
            await dataService.archiveTopic(postId);
            
        } catch (error) {
            return;
        }

        ctx.redirect('/');
    }
}
