import { html } from "@lit/lit-html.js";
import { topicService, categoryService } from "../service/dataService.js";
import { banService } from "../service/userService.js";
import { FormLocker, submitHandler } from "../utils/submitUtil.js";
import { ErrorNotific } from "../utils/notificationUtil.js";

const template = (categoryList, roleForVideo, createHandler) => html`
<section id="create-topic">
    <h1>Create a New Topic</h1>
    <form id="create-form" @submit=${createHandler}>
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
    const userId = ctx.userUtils.getUserData()?.objectId;
    const isBanned = await banService.isActiveBan(userId);

    if(isBanned){
        ctx.redirect('/ban-message');
        return;
    }

    const categoryList = await categoryService.getAllCategories(true);
    const roleForVideo = ctx.userUtils.isAdmin() || ctx.userUtils.isModerator() || ctx.userUtils.isTopUser();

    ctx.render(template(categoryList, roleForVideo, submitHandler(onCreate)));
    const sectionId = 'create-topic';

    async function onCreate({ category, title, videoUrl, content }, form) {
        const locker = new FormLocker('create-form');
        locker.lockForm();

        if (!category) {
            locker.unlockForm();
            return new ErrorNotific('Please choose a category!').showNotificIn(sectionId);
        }

        if (title.length < 4 || title.length > 80) {
            locker.unlockForm();
            return new ErrorNotific('Title length must be between 4 and 80 characters long.').showNotificIn(sectionId);
        }

        if (content.length < 10) {
            locker.unlockForm();
            return new ErrorNotific('Content must be at least 10 characters long.').showNotificIn(sectionId);
        }

        if (videoUrl) {
            const prefix = 'https://www.youtube.com/';
            if (!videoUrl.startsWith(prefix)) {
                locker.unlockForm();
                return new ErrorNotific('Incorrect video URL!').showNotificIn(sectionId);
            }
            videoUrl = videoUrl.replace('watch?v=', 'embed/');
        }

        const authorId = ctx.userUtils.getUserData()?.objectId;

        try {
            const result = await topicService.createNewTopic(title, content, authorId, category, videoUrl);
            ctx.redirect('/topic/' + result.objectId);

        } catch (error) {
            locker.unlockForm();
            return new ErrorNotific(error).showNotificIn(sectionId);
        }

        form.reset();
    }
}
