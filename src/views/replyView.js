import { html } from "@lit/lit-html.js";
import { topicService, replyService } from "../service/dataService.js";
import { banService } from "../service/userService.js";
import { FormLocker, submitHandler } from "../utils/submitUtil.js";
import { ErrorNotific, SuccessNotific } from "../utils/notificationUtil.js";

const template = (data, roleForVideo, replyHandler) => html`
<section id="reply-topic">
    <h1>Reply to</h1>
    <form id="reply-form" @submit=${replyHandler}>
        <input ?hidden=${true} type="text" id="objectId" name="objectId" .value=${data.objectId}>

        <label for="title">Title</label>
        <input ?disabled=${true} type="text" id="title" name="title" .value=${data.title}>

        ${roleForVideo ? html`
            <label for="videoUrl">Video URL</label>
            <input type="text" id="videoUrl" name="videoUrl">
            <p class="explanation">(Here you can embed a youtube video.)</p>
        `: null}

        <label for="content">Content</label>
        <textarea id="content" name="content" rows="10"></textarea>

        <button id="submit" type="submit" class="reply-button">Reply</button>
    </form>
</section>
`

export async function showReplyView(ctx) {
    const userId = ctx.userUtils.getUserData()?.objectId;
    const isBanned = await banService.isActiveBan(userId);

    if(isBanned){
        ctx.redirect('/ban-message');
        return;
    }

    const id = ctx.params.id;
    const data = await topicService.getTopicDetails(id);
    const roleForVideo = ctx.userUtils.isAdmin() || ctx.userUtils.isModerator() || ctx.userUtils.isTopUser();

    ctx.render(template(data, roleForVideo, submitHandler(onReply)));
    const sectionId = 'reply-topic';

    async function onReply({ objectId, videoUrl, content }, form) {
        const locker = new FormLocker('reply-form');
        locker.lockForm();

        if (!content) {
            locker.unlockForm();
            return new ErrorNotific("Content can't be an empty field.").showNotificIn(sectionId);
        }

        const authorId = ctx.userUtils.getUserData()?.objectId;

        if (videoUrl) {
            const prefix = 'https://www.youtube.com/';
            if (!videoUrl.startsWith(prefix)) {
                return new ErrorNotific('Incorrect video URL!').showNotificIn(sectionId);
            }
            videoUrl = videoUrl.replace('watch?v=', 'embed/');
        }

        try {
            await replyService.addNewReply(content, authorId, objectId, videoUrl);

        } catch (error) {
            locker.unlockForm();
            return new ErrorNotific(error).showNotificIn(sectionId);
        }

        form.reset();
        ctx.redirect('/topic/' + objectId);
        setTimeout(()=> new SuccessNotific('You have replied successfully.').showNotificIn('topic'), 3000);
    }
}