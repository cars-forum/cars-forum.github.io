import { html } from "@lit/lit-html.js";
import { dataService } from "../service/dataService.js";
import { submitHandler, FormLocker } from "../utils/submitUtil.js";

const template = (data, categoryList, editHandler) => html`
<section id="edit-topic">
    <h1>Edit Topic</h1>
    <form @submit=${editHandler}>
        <label for="category">Category</label>
        <select id="category" name="category" .value=${data.category}>
            ${categoryList.map(categoryTemplate)}
        </select>

        <label for="title">Title</label>
        <input type="text" id="title" name="title" .value=${data.title}>

        <label for="content">Content</label>
        <textarea id="content" name="content" rows="10" .value=${data.content}></textarea>

        <button id="submit" type="submit" class="button">Edit Topic</button>
    </form>
</section>
`

const categoryTemplate = (item) => html`
    <option value=${item.objectId}>${item.title}</option>
`

export async function showEditTopicView(ctx) {
    const id = ctx.params.id;
    const data = await dataService.getTopicDetails(id);
    const categoryList = await dataService.getAllCategories();
    selectCurrentCategory(data, categoryList);

    ctx.render(template(data, categoryList, submitHandler(onEdit)));

    async function onEdit({ "category": categoryId, title, content }, form) {
        const locker = new FormLocker(['category', 'title', 'content', 'submit']);
        locker.lockForm();

        if (!categoryId) {
            locker.unlockForm();
            return alert('Please choose a category!');
        }

        if (title.length < 4 || title.length > 30) {
            locker.unlockForm();
            return alert('Title length must be between 4 and 30 characters long.');
        }

        if (content.length < 10) {
            locker.unlockForm();
            return alert('Content must be at least 10 characters long.');
        }

        const editor = ctx.userUtils.getUserData()?.username;
        const editDate = new Date().toLocaleString('uk-Uk');
        const editInfo = `\nEdited at ${editDate} by ${editor}`;
        content += editInfo;

        try {
            await dataService.editTopic(id, categoryId, title, content);

        } catch (error) {
            return;
        }

        form.reset();
        ctx.redirect('/topic/' + id);
    }

    function selectCurrentCategory(data, categoryList) {
        const currentCategoryId = data.category.objectId;
        const categoriesId = [];
        categoryList.forEach(category => {
            const { objectId } = category;
            categoriesId.push(objectId);
        });

        const index = categoriesId.indexOf(currentCategoryId);
        const currentCategory = categoryList.splice(index, 1);

        categoryList.unshift(currentCategory[0]);
        return categoryList;
    }
}