import { user } from "../utils/userUtils.js";

export function addSessionControl(params) {
    return function (ctx, next) {
        ctx.userUtils = { ...user };

        next();
    }
}