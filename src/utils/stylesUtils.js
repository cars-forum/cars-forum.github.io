import { ROLES } from "../service/roles.js";

const userKey = ROLES.user;
const topUserKey = ROLES.topUser;
const moderatorKey = ROLES.moderator;
const adminKey = ROLES.admin;

const user = {
    color: '#fff',
    backgroundColor: '#333'
}

const topUser = {
    color: '#333',
    backgroundColor: '#85C3FF'
}

const moderator = {
    color: '#fff',
    backgroundColor: '#008500'
}

const admin = {
    color: '#fff',
    backgroundColor: '#C9000A'
}

const roleStyles = {}

roleStyles[userKey] = user;
roleStyles[topUserKey] = topUser;
roleStyles[moderatorKey] = moderator;
roleStyles[adminKey] = admin;

export { roleStyles };