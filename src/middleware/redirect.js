import page from "@page/page.mjs";

export function addRedirect() {
    return function(ctx, next) {
        ctx.redirect = redirect;

        next();
    };

    function redirect(path) {
        page.redirect(path);
    }
}