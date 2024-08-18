import { api } from "./api.js";

const endpoints = {
    topicsOfCategory: (categoryId) => `/classes/Posts/?include=author&where={"category":{"__type":"Pointer","className":"Categories","objectId":"${categoryId}"}}`,
    categories: '/classes/Categories/?order=createdAt',
    topic: (topicId) => `/classes/Posts/${topicId}?include=author`,
    creatingPost: '/classes/Posts',
    creatingReply: '/classes/Replies',
    allRepliesOfPost: (postId) => `/classes/Replies?where={"post":{"__type":"Pointer","className":"Posts","objectId":"${postId}"}}&include=author`,
    changeTopicLock: (postId) => `/classes/Posts/${postId}`
}

async function getAllCategories() {
    const result = await api.get(endpoints.categories);
    return result.results;
}

async function getTopics(categoryId) {
    const result = await api.get(endpoints.topicsOfCategory(categoryId));
    return result.results;
}

async function getTopicDetails(topicId) {
    return await api.get(endpoints.topic(topicId));
}

async function createNewTopic(title, content, authorId, categoryId) {
    return await api.post(endpoints.creatingPost, {
        title,
        content,
        author: { "__type": "Pointer", "className": "_User", "objectId": authorId },
        category: { "__type": "Pointer", "className": "Categories", "objectId": categoryId }
    });
}

async function addNewReply(content, authorId, postId) {
    return await api.post(endpoints.creatingReply, {
        content,
        "author": { "__type": "Pointer", "className": "_User", "objectId": authorId },
        "post": { "__type": "Pointer", "className": "Posts", "objectId": postId }
    });
}

async function getAllReplies(postId) {
    const result = await api.get(endpoints.allRepliesOfPost(postId));
    return result.results;
}

async function changeTopicLockingState(postId, state) {
    return await api.put(endpoints.changeTopicLock(postId), { isLocked: state });
}

export const dataService = {
    getAllCategories,
    getTopics,
    getTopicDetails,
    createNewTopic,
    addNewReply,
    getAllReplies,
    changeTopicLockingState
};