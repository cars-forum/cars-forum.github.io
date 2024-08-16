import { user } from "../utils/userUtils.js";

export function addSessionControl(params) {
    return function(ctx, next) {
        ctx.getUserData = user.getUserData;

        next();
    }
}