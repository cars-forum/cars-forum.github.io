import page from '@page/page.mjs';
import { html, render } from '@lit/lit-html.js';

page('/', () => console.log('Works!'));

page.start();

function greet(text) {
    const main = document.querySelector('main');
    const temp = () => html`<h1>${text}</h1>`

    render(temp(), main);
}

greet('Test');