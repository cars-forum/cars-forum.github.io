import { html } from "@lit/lit-html.js";

const template = (userData) => html`
<section id="home">
    <h1>Forum Categories</h1>
    <div class="category">
        <h2>Category 1</h2>
        <ul>
            <li><a href="topic.html">Topic 1</a></li>
            <li><a href="topic.html">Topic 2</a></li>
        </ul>
    </div>
    <div class="category">
        <h2>Category 2</h2>
        <ul>
            <li><a href="topic.html">Topic 3</a></li>
            <li><a href="topic.html">Topic 4</a></li>
        </ul>
    </div>
    ${userData ? html`
    <button class="create-button">Create New Topic</button>
    `: null}
</section>
`

export function showHomeView(ctx) {
    const userData = ctx.getUserData();
    ctx.render(template(userData));
}