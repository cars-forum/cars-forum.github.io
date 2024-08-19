import { html } from "@lit/lit-html.js";
import { dataService } from "../service/dataService.js";
import { FormLocker, submitHandler } from "../utils/submitUtil.js";

const template = (data, replyHandler) => html`
<section id="reply-topic">
    <h1>Reply to</h1>
    <form @submit=${replyHandler}>
        <input ?hidden=${true} type="text" id="objectId" name="objectId" .value=${data.objectId}>

        <label for="title">Title</label>
        <input ?disabled=${true} type="text" id="title" name="title" .value=${data.title}>

        <label for="content">Content</label>
        <textarea id="content" name="content" rows="10"></textarea>

        <button id="submit" type="submit" class="reply-button">Reply</button>
    </form>
</section>
`

export async function showReplyView(ctx) {
    const id = ctx.params.id;
    const data = await dataService.getTopicDetails(id);

    ctx.render(template(data, submitHandler(onReply)));

    async function onReply({ objectId, content }, form) {
        const locker = new FormLocker(['content', 'submit']);
        locker.lockForm();

        if (!content) {
            locker.unlockForm();
            return alert("Content can't be an empty field.");
        }

        const authorId = ctx.userUtils.getUserData()?.objectId;

        try {
            await dataService.addNewReply(content, authorId, objectId);

        } catch (error) {
            locker.unlockForm();
            return;
        }

        form.reset();
        ctx.redirect('/topic/' + objectId);
    }
}