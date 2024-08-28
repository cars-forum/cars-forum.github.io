import { html } from "@lit/lit-html.js";
import { dataService } from "../service/dataService.js";
import { FormLocker, submitHandler } from "../utils/submitUtil.js";

const template = (categoryList, roleForVideo, createHandler) => html`
<section id="create-topic">
    <h1>Create a New Topic</h1>
    <form @submit=${createHandler}>
        <label for="category">Category</label>
        <select id="category" name="category">
            ${categoryList.map(categoryTemplate)}
        </select>

        <label for="title">Title</label>
        <input type="text" id="title" name="title">

        ${roleForVideo ? html`
            <label for="videoUrl">Video URL</label>
            <input type="text" id="videoUrl" name="videoUrl">
            <p class="explanation">(Here you can embed a youtube video.)</p>
        `: null}

        <label for="content">Content</label>
        <textarea id="content" name="content" rows="10"></textarea>

        <button id="submit" type="submit" class="create-button">Create Topic</button>
    </form>
</section>
`

const categoryTemplate = (item) => html`
    <option value=${item.objectId}>${item.title}</option>
`

export async function showCreateTopicView(ctx) {
    const categoryList = await dataService.getAllCategories(true);
    const roleForVideo = ctx.userUtils.isAdmin() || ctx.userUtils.isModerator() || ctx.userUtils.isTopUser();

    ctx.render(template(categoryList, roleForVideo, submitHandler(onCreate)));


    async function onCreate({ category, title, videoUrl, content }, form) {
        const locker = new FormLocker(['category', 'title', 'content', 'submit']);
        locker.lockForm();

        if (!category) {
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

        if (videoUrl) {
            const prefix = 'https://www.youtube.com/';
            if (!videoUrl.startsWith(prefix)) {
                return alert('Incorrect video URL!');
            }
            videoUrl = videoUrl.replace('watch?v=', 'embed/');
        }

        const authorId = ctx.userUtils.getUserData()?.objectId;

        try {
            const result = await dataService.createNewTopic(title, content, authorId, category, videoUrl);
            ctx.redirect('/topic/' + result.objectId);

        } catch (error) {
            locker.unlockForm();
            return;
        }

        form.reset();
    }
}
