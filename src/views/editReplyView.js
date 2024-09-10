import { html } from "@lit/lit-html.js";
import { replyService } from "../service/dataService.js";
import { FormLocker, submitHandler } from "../utils/submitUtil.js";
import { ErrorNotific } from "../utils/notificationUtil.js";

const template = (data, editHandler) => html`
<section id="edit-reply">
    <h1>Edit Reply</h1>
    <form id="edit-form" @submit=${editHandler}>
        <label for="title">Title</label>
        <input ?disabled=${true} type="text" id="title" name="title" .value=${data.post.title}>

        <label for="content">Content</label>
        <textarea id="content" name="content" rows="10" .value=${data.content}></textarea>

        <button id="submit" type="submit" class="button">Edit Topic</button>
    </form>
</section>
`

export async function showEditReplyView(ctx) {
    const id = ctx.params.id;
    const data = await replyService.getReplyDetails(id);
    const postId = data.post.objectId;

    ctx.render(template(data, submitHandler(onEdit)));
    const sectionId = 'edit-reply';

    async function onEdit({ content }, form) {
        const locker = new FormLocker('edit-form');
        locker.lockForm();

        if (!content) {
            locker.unlockForm();
            return new ErrorNotific('Content must be at least 10 characters long.').showNotificIn(sectionId);
        }

        const editor = ctx.userUtils.getUserData()?.username;
        const editDate = new Date().toLocaleString('uk-Uk');
        const editInfo = `\nEdited at ${editDate} by ${editor}`;
        content += editInfo;

        try {
            await replyService.editReply(id, content);

        } catch (error) {
            locker.unlockForm();
            return new ErrorNotific(error).showNotificIn(sectionId);
        }

        form.reset();
        ctx.redirect('/topic/' + postId);
    }
}