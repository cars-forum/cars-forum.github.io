import { html } from "@lit/lit-html.js";
import { FormLocker, submitHandler } from "../utils/submitUtil.js";
import { categoryService } from "../service/dataService.js";

const template = (createHandler) => html`
<section id="create-category">
    <h1>Create a New Category</h1>
    <form id="create-form" @submit=${createHandler}>
        <label for="title">Category Title</label>
        <input type="text" id="title" name="title">
        <button type="submit" id="submit" class="create-button">Create Category</button>
    </form>
</section>
`

export function showCreateCategoryView(ctx) {
    ctx.render(template(submitHandler(onCreate)));

    async function onCreate({ title }, form) {
        const locker = new FormLocker('create-form');
        locker.lockForm();

        if (!title) {
            locker.unlockForm();
            return alert('Choose a correct category name!');
        }

        try {
            await categoryService.createNewCategory(title);

        } catch (error) {
            locker.unlockForm();
            return;
        }

        form.reset();
        ctx.redirect('/');
    }
}