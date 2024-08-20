import { html } from "@lit/lit-html.js";
import { dataService } from "../service/dataService.js";
import { FormLocker, submitHandler } from "../utils/submitUtil.js";

const template = (data, editHandler) => html`
<section id="edit-reply">
    <h1>Edit Reply</h1>
    <form @submit=${editHandler}>
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
    const data = await dataService.getReplyDetails(id);
    const postId = data.post.objectId;

    ctx.render(template(data, submitHandler(onEdit)));

    async function onEdit({ content }, form) {
        const locker = new FormLocker(['content', 'submit']);
        locker.lockForm();

        if (!content) {
            locker.unlockForm();
            return alert('Content must be at least 10 characters long.');
        }

        const editor = ctx.userUtils.getUserData()?.username;
        const editDate = new Date().toLocaleString('uk-Uk');
        const editInfo = `\nEdited at ${editDate} by ${editor}`;
        content += editInfo;

        try {
            await dataService.editReply(id, content);

        } catch (error) {
            locker.unlockForm();
            return;
        }

        form.reset();
        ctx.redirect('/topic/' + postId);
    }
}