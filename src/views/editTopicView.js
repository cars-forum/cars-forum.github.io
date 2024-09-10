import { html } from "@lit/lit-html.js";
import { topicService, categoryService } from "../service/dataService.js";
import { submitHandler, FormLocker } from "../utils/submitUtil.js";
import { ErrorNotific } from "../utils/notificationUtil.js";

const template = (data, categoryList, editHandler) => html`
<section id="edit-topic">
    <h1>Edit Topic</h1>
    <form id="edit-form" @submit=${editHandler}>
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
    const data = await topicService.getTopicDetails(id);
    const categoryList = await categoryService.getAllCategories();
    selectCurrentCategory(data, categoryList);

    ctx.render(template(data, categoryList, submitHandler(onEdit)));
    const sectionId = 'edit-topic';

    async function onEdit({ "category": categoryId, title, content }, form) {
        const locker = new FormLocker('edit-form');
        locker.lockForm();

        if (!categoryId) {
            locker.unlockForm();
            return new ErrorNotific('Please choose a category!').showNotificIn(sectionId);
        }

        if (title.length < 4 || title.length > 30) {
            locker.unlockForm();
            return new ErrorNotific('Title length must be between 4 and 30 characters long.').showNotificIn(sectionId);
        }

        if (content.length < 10) {
            locker.unlockForm();
            return new ErrorNotific('Content must be at least 10 characters long.').showNotificIn(sectionId);
        }

        const editor = ctx.userUtils.getUserData()?.username;
        const editDate = new Date().toLocaleString('uk-Uk');
        const editInfo = `\nEdited at ${editDate} by ${editor}`;
        content += editInfo;

        try {
            await topicService.editTopic(id, categoryId, title, content);

        } catch (error) {
            locker.unlockForm();
            return new ErrorNotific(error).showNotificIn(sectionId);
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