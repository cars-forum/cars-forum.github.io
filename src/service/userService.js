import { user } from "../utils/userUtils.js";
import { api } from "./api.js";

const endpoints = {
    register: '/users',
    login: '/login',
    logout: '/logout'
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
        sessionToken: result.sessionToken
    };

    user.setUserData(userData);
}

async function logout() {
    await api.post(endpoints.logout);
    user.clearUserData();
}

export const userService = {
    register,
    login,
    logout
}