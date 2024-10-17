import { html } from "@lit/lit-html.js";
import { topicService, categoryService } from "../service/dataService.js";

const template = (categories, userData, isAdmin) => html`
            <div class="content-buttons">
                ${userData ? html`<a href="/create-topic" class="button">Create New Topic</a>`:null}
                ${isAdmin ? html`<a href="/create-category" class="button">Create New Category</a>`:null}
            </div>
            ${categories.map(categoryTemplate)}
`

const categoryTemplate = (item) => html`
<section class="category-group">
                <header class="category-header">
                    <h3 class="category-title">${item.title}</h3>
                </header>
                <article>
                    <ul>
                        ${item.topics.map(topicTemplate)}
                    </ul>
                </article>
            </section>
`

const topicTemplate = (item) => html`
                        <li>
                            <a href="/topic/${item.objectId}" class="topic-link">
                                <div class="topic-icon">
                                    ${item.isLocked ? 
                                        html`<i class="fa-solid fa-lock"></i>` :
                                        html`<i class="fa-regular fa-newspaper"></i>`}
                                </div>
                                <div class="topic-title">
                                    <h4>${item.title}</h4>
                                </div>
                                <div class="topic-author">
                                    <p>${item.author.username}</p>
                                </div>
                                <div class="topic-date"><time datetime="${item.createdAt}">${new Date(item.createdAt).toLocaleDateString('uk-Uk')}</time></div>
                            </a>
                        </li>
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