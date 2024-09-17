import { html } from "@lit/lit-html.js";
import { topicService, categoryService } from "../service/dataService.js";

const template = (categories, userData, isAdmin) => html`
<section id="home">
    <h1>Forum Categories</h1>
    ${isAdmin ? html`
    <a class="button" href="/create-category">Create New Category</a>
    `: null}
    ${categories.map(categoryTemplate)}
    ${userData ? html`
    <a class="button" href="/create-topic">Create New Topic</a>
    `: null}
</section>
`

const categoryTemplate = (item) => html`
    <div class="category">
        <h2>${item.title}</h2>
        <ul>
            ${item.topics.map(topicTemplate)}
        </ul>
    </div>
`

const topicTemplate = (item) => html`
            <li><a href="/topic/${item.objectId}"><strong>${item.title}</strong> | By: ${item.author.username} | Created on: ${new Date(item.createdAt).toLocaleDateString('uk-Uk')}</a></li>
`

export async function showHomeView(ctx) {
    const categories = await categoryService.getAllCategories();
    
    const categoriesWithTopics = await Promise.all(categories.map(async (category) => {
        const topics = await topicService.getTopics(category.objectId);
        return { ...category, topics };
    }));

    const userData = ctx.userUtils.getUserData();
    const isAdmin = ctx.userUtils.isAdmin();
    ctx.render(template(categoriesWithTopics, userData, isAdmin));
}