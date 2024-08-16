import page from '@page/page.mjs';
import { html, render } from '@lit/lit-html.js';

import { addRender } from './middleware/render.js';
import { addRedirect } from './middleware/redirect.js';
import { addNavControl } from './middleware/navigation.js';

const root = document.querySelector('main');

if (!root) {
    throw new ReferenceError('Document has no valid root!');
}

page(addRender(root));
page(addRedirect());
page(addNavControl());
page('/', () => console.log('Works!'));
page('/register');
page('/login');

page.start();

function greet(text) {
    const main = document.querySelector('main');
    const temp = () => html`<h1>${text}</h1>`

    render(temp(), main);
}

greet('Test');