import { html } from "@lit/lit-html.js";
import { styleMap } from '@lit/directives/style-map.js';
import { topicService, replyService, commonDataService } from "../service/dataService.js";
import { roleStyles } from "../utils/stylesUtils.js";
import { ErrorNotific } from "../utils/notificationUtil.js";

const template = (data, replies, userData, isAdminOrMod, editPermisions, deletePermisions, isArchived, handlers) => {
    const userCardTemplate = (data) => {
        const roleStyle = roleStyles[data["author"]["role"]["objectId"]];
        const brandStyle = { width: "60px", height: "60px" };
        return html`
    <div class="user-details">
        ${data.author.avatar === 'avatar.png' || data.author.avatar === 'admin-avatar.png' ? html`
            <img src="/static/img/${data.author.avatar}" alt="User Avatar" id="avatar-img">
        `: html`
            <img src="${data.author.avatar}" alt="User Avatar" id="avatar-img">
        `}
        <p><a href="/profile/${data.author.objectId}">${data.author.username}</a></p>
        <p>Replies: <span id="replies">${data.author.repliesCount}</span></p>
        <p>Registered on: <span id="registered-on">${new Date(data.author.createdAt).toLocaleDateString('uk-Uk')}</span></p> 
        ${data.author.location ? html`
            <p>Location: <span id="location">${data.author.location}</span></p>
        `: null}
        ${data.author.preferredManufacturer ? html`<p class="brand-label">Prefers:<br /> <img style=${styleMap(brandStyle)} src="${data.author.preferredManufacturer}"></p>` : null}
        <p><span style=${styleMap(roleStyle)} id="role-info">${data.author.role.name}</span></p>
    `}

    const commentTemplate = (item) => html`
    <div class="comment">
        ${userCardTemplate(item)}
        <div class="user-comment">
            <p>Replied at: ${new Date(item.createdAt).toLocaleString('uk-Uk')}</p>
            ${item.videoUrl ? html`
                <iframe width="560" height="315"
                    src="${item.videoUrl}">
                </iframe>
            `: null}
            ${item.content.map(par => html`<p>${par}</p>`)}
            ${editPermisions(item.author.objectId) && !data.isLocked ? html`
                <a href="/edit-reply/${item.objectId}" class="button">Edit</a>
            `: null}
            ${deletePermisions ? html`
            <a @click=${handlers.deleteReply} href="javascript:void(0)" data-id="${item.objectId}" class="button">Delete</a>
            `: null}
        </div>
    </div>
`

    return html`
    <section id="topic">
    ${isAdminOrMod && !isArchived ? html`
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
        ${userCardTemplate(data)}
        <div class="user-comment">
            <p>Published at: ${new Date(data.createdAt).toLocaleString('uk-Uk')}</p>
            ${data.videoUrl ? html`
            <iframe width="560" height="315"
                src="${data.videoUrl}">
            </iframe>
            `: null}
            ${data.content.map(par => html`<p>${par}</p>`)}
            ${editPermisions(data.author.objectId) && !data.isLocked ? html`
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
    const data = await topicService.getTopicDetails(id);
    const repliesCount = await commonDataService.getUserRepliesCount(data.author.objectId);
    data.author.repliesCount = repliesCount;
    let replies = await replyService.getAllReplies(id);
    data.content = data.content.split('\n');

    replies = await Promise.all(replies.map(async rep => {
        const result = { ...rep }
        result.content = rep.content.split('\n');

        const comRepliesCount = await commonDataService.getUserRepliesCount(rep.author.objectId);
        result.author.repliesCount = comRepliesCount;

        return result;
    }));

    const userData = ctx.userUtils.getUserData();
    const isAdminOrMod = ctx.userUtils.isAdmin() || ctx.userUtils.isModerator();
    const editPermisions = (replyId) => ctx.userUtils.isAdmin() || ctx.userUtils.isModerator() || (ctx.userUtils.isTopUser() && ctx.userUtils.isOwner(replyId));
    const deletePermisions = ctx.userUtils.isAdmin() || ctx.userUtils.isModerator();
    const isArchived = data.category.objectId === "IHKYWUnBbb";
    const handlers = {
        lockTopic,
        unlockTopic,
        archiveTopic,
        deleteReply
    };

    ctx.render(template(data, replies, userData, isAdminOrMod, editPermisions, deletePermisions, isArchived, handlers));
    const sectionId = 'topic';

    async function lockTopic(e) {
        const confirmation = confirm('Do you want to lock this topic?');

        if (!confirmation) {
            return;
        }

        const currentTarget = e.currentTarget;
        const postId = currentTarget.getAttribute('data-id');
        try {
            await topicService.changeTopicLockingState(postId, true);

        } catch (error) {
           return new ErrorNotific(error).showNotificIn(sectionId);
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
            await topicService.changeTopicLockingState(postId, false);

        } catch (error) {
            return new ErrorNotific(error).showNotificIn(sectionId);
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
            await topicService.archiveTopic(postId);

        } catch (error) {
            return new ErrorNotific(error).showNotificIn(sectionId);
        }

        ctx.redirect('/');
    }

    async function deleteReply(e) {
        const confirmation = confirm('Are you sure you want to remove this comment?');

        if(!confirmation){
            return;
        }
        
        const replyId = e.currentTarget.getAttribute('data-id');

        try {
            await replyService.deleteReply(replyId);

        } catch (error) {
            return new ErrorNotific(error).showNotificIn(sectionId);
        }

        ctx.redirect('/topic/' + id);
    }
}