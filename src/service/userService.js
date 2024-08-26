import { user } from "../utils/userUtils.js";
import { api } from "./api.js";
import { ROLES } from "./roles.js";

const endpoints = {
    register: '/users',
    login: '/login',
    logout: '/logout',
    userInfo: (userId) => `/users/${userId}?include=role`,
    updateProfile: (userId) => `/users/${userId}`
}

async function register(username, email, password) {
    const result = await api.post(endpoints.register, { username, email, password });

    const userData = {
        username,
        objectId: result.objectId,
        sessionToken: result.sessionToken
    };

    user.setUserData(userData);
}

async function login(username, password) {
    const result = await api.post(endpoints.login, { username, password });

    const userData = {
        username: result.username,
        objectId: result.objectId,
        sessionToken: result.sessionToken,
        roleId: result?.role?.objectId
    };

    user.setUserData(userData);
}

async function logout() {
    await api.post(endpoints.logout);
    user.clearUserData();
}

async function getUserInfo(userId) {
    return await api.get(endpoints.userInfo(userId));
}

async function updateUserInfo(userId, data) {
    return await api.put(endpoints.updateProfile(userId), data);
}

export const userService = {
    register,
    login,
    logout,
    getUserInfo,
    updateUserInfo
}

async function changeRole(roleId, userId) {
    return await api.put(endpoints.updateProfile(userId), {
        role: { __type: 'Pointer', className: '_Role', objectId: roleId }
    });
}

const changeToUser = (userId) => changeRole(ROLES.user, userId);

const changeToTopUser = (userId) => changeRole(ROLES.topUser, userId);

const changeToModerator = (userId) => changeRole(ROLES.moderator, userId);

const changeToAdmin = (userId) => changeRole(ROLES.admin, userId);

export const roleService = {
    user: changeToUser,
    topUser:changeToTopUser,
    moderator: changeToModerator,
    admin: changeToAdmin
}