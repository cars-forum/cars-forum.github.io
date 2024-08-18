import { html } from "@lit/lit-html.js";
import { dataService } from "../service/dataService.js";
import { submitHandler } from "../utils/submitUtil.js";

const template = (categoryList, createHandler) => html`
<section id="create-topic">
    <h1>Create a New Topic</h1>
    <form @submit=${createHandler}>
        <label for="category">Category</label>
        <select id="category" name="category">
            ${categoryList.map(categoryTemplate)}
        </select>

        <label for="title">Title</label>
        <input type="text" id="title" name="title">

        <label for="content">Content</label>
        <textarea id="content" name="content" rows="10"></textarea>

        <button type="submit" class="create-button">Create Topic</button>
    </form>
</section>
`

const categoryTemplate = (item) => html`
    <option value=${item.objectId}>${item.title}</option>
`

export async function showCreateTopicView(ctx) {
    const categoryList = await dataService.getAllCategories();
    ctx.render(template(categoryList,submitHandler(onCreate)));


    async function onCreate({ category, title, content }, form) {
        debugger;
        if(!category){
            return alert('Please choose a category!');
        }
    
        if(title.length < 4 || title.length > 30){
            return alert('Title length must be between 4 and 30 characters long.');
        }
    
        if(content.length < 10){
            return alert('Content must be at least 10 characters long.');
        }
    
        const authorId = ctx.userUtils.getUserData()?.objectId;
    
        try {
            const result = await dataService.createNewTopic(title, content, authorId, category);
            ctx.redirect('/topic/'+result.objectId);

        } catch (error) {
            return;
        }

        form.reset();
    }
}
