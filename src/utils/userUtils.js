import { ROLES } from "../service/roles.js";

const browserStorage = localStorage;

function setUserData(data) {
    browserStorage.setItem('userData', JSON.stringify(data));
}

function getUserData() {
    return JSON.parse(browserStorage.getItem('userData'));
}

function clearUserData() {
    browserStorage.removeItem('userData');
}

function getSessionToken() {
    return getUserData().sessionToken;
}

// function isOwner(ownerItemId) {
//     const userId = getUserData()?._id;
//     return userId === ownerItemId;
// }

function isAdmin() {
    const roleId = getUserData()?.roleId;
    return roleId === ROLES.admin;
}

function isModerator() {
    const roleId = getUserData()?.roleId;
    return roleId === ROLES.moderator;
}

function isTopUser() {
    const roleId = getUserData()?.roleId;
    return roleId === ROLES.topUser;
}

export const user = {
    setUserData,
    getUserData,
    clearUserData,
    getSessionToken,
    // isOwner,
    isAdmin,
    isModerator,
    isTopUser,
};