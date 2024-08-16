import { render as baseRender } from '@lit/lit-html.js';

export function addRender(root) {
    return function (ctx, next) {
        ctx.render = render;

        next();
    };

    function render(template, container = root) {
        baseRender(template, container);
    }
}