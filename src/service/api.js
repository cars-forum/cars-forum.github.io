import { user } from "../utils/userUtils.js";
import { appId, apiKey } from "./apiKeys.js";

const hostname = 'https://parseapi.back4app.com';

async function requester(method, url, data) {
    const options = {
        method,
        headers: {
            'X-Parse-Application-Id': appId,
            'X-Parse-JavaScript-Key': apiKey
        },
    }

    if (data) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    const userData = user.getUserData();

    if (userData) {
        options.headers['X-Parse-Session-Token'] = user.getSessionToken();
    }

    try {
        const response = await fetch(hostname + url, options);

        if (!response.ok) {
            const error = await response.json();

            throw new Error(error.error);
        }

        if (response.status === 204) {
            return response;

        } else {
            return await response.json();
        }

    } catch (error) {
        // alert(error);
        throw error;
    }
}

const get = (url) => requester('GET', url,)
const post = (url, data) => requester('POST', url, data)
const put = (url, data) => requester('PUT', url, data)
const del = (url) => requester('DELETE', url)

export const api = {
    get,
    post,
    put,
    del
};