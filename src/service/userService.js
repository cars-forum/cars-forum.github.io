import { user } from "../utils/userUtils.js";
import { api } from "./api.js";
import { ROLES } from "./protected.js";

const endpoints = {
    // Sign In endpoints
    register: '/users',
    login: '/login',
    logout: '/logout',

    // Common endpoints
    userInfo: (userId) => `/users/${userId}?include=role`,
    updateProfile: (userId) => `/users/${userId}`,

    // Ban endpoints
    ban: '/classes/Bans',
    banChecker: (userId) => `/classes/Bans?where={"user":{"__type":"Pointer","className":"_User","objectId":"${userId}"}}&order=-expiresOn&limit=1`
}

async function register(username, email, password) {
    const result = await api.post(endpoints.register, {
        username,
        email,
        password,
        role: { __type: 'Pointer', className: '_Role', objectId: ROLES.user },
        location: ''
    });

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

async function banUser(userId, expiresOn, reason) {
    const isoDate = expiresOn.toISOString();
    const data = {
        expiresOn: {
            '__type': 'Date',
            'iso': isoDate
        },
        user: { __type: 'Pointer', className: '_User', objectId: userId }
    };

    if (reason) {
        data.reason = reason;
    }

    return await api.post(endpoints.ban, data);
}

async function isActiveBan(userId) {
    const result = await api.get(endpoints.banChecker(userId));

    if (!result.results.length) {
        return false;
    }

    const expDate = new Date(result.results[0].expiresOn.iso)
    const now = new Date();
    return expDate > now;
}

async function getBanInfo(userId) {
    const result = await api.get(endpoints.banChecker(userId));
    return result.results[0];
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


const signInService = {
    register,
    login,
    logout
}

const userService = {
    getUserInfo,
    updateUserInfo
}

const roleService = {
    user: changeToUser,
    topUser: changeToTopUser,
    moderator: changeToModerator,
    admin: changeToAdmin
}

const banService = {
    banUser,
    isActiveBan,
    getBanInfo
}

export {
    signInService,
    userService,
    roleService,
    banService
}