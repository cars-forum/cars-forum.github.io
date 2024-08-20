import { api } from "./api.js";

const endpoints = {
    topicsOfCategory: (categoryId) => `/classes/Posts/?include=author&where={"category":{"__type":"Pointer","className":"Categories","objectId":"${categoryId}"}}`,
    categories: '/classes/Categories/?order=isLast,createdAt',
    categoriesNoLast: '/classes/Categories/?where={"isLast":false}&order=createdAt',
    topic: (topicId) => `/classes/Posts/${topicId}?include=author`,
    creatingPost: '/classes/Posts',
    creatingReply: '/classes/Replies',
    creatingCategory: '/classes/Categories',
    allRepliesOfPost: (postId) => `/classes/Replies?where={"post":{"__type":"Pointer","className":"Posts","objectId":"${postId}"}}&include=author`,
    changeTopic: (postId) => `/classes/Posts/${postId}`,
    reply: (replyId) => `/classes/Replies/${replyId}?include=post`,
    changeReply: (replyId) => `/classes/Replies/${replyId}`
}

async function getAllCategories(withoutLast = false) {
    let url = endpoints.categories;
    if (withoutLast) {
        url = endpoints.categoriesNoLast;
    }
    const result = await api.get(url);
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
    return await api.put(endpoints.changeTopic(postId), { isLocked: state });
}

async function editTopic(postId, categoryId, title, content) {
    return await api.put(endpoints.changeTopic(postId), {
        category: { "__type": "Pointer", "className": "Categories", "objectId": categoryId },
        title,
        content
    });
}

async function getReplyDetails(replyId) {
    return await api.get(endpoints.reply(replyId));
}

async function editReply(replyId, content) {
    return await api.put(endpoints.changeReply(replyId), { content });
}

async function createNewCategory(title) {
    return await api.post(endpoints.creatingCategory, { title });
}

async function archiveTopic(postId) {
    return await api.put(endpoints.changeTopic(postId), {
        isLocked: true, category: {
            "__type": "Pointer", "className": "Categories", "objectId": "IHKYWUnBbb"
        }
    });
}

export const dataService = {
    getAllCategories,
    getTopics,
    getTopicDetails,
    createNewTopic,
    addNewReply,
    getAllReplies,
    changeTopicLockingState,
    editTopic,
    getReplyDetails,
    editReply,
    createNewCategory,
    archiveTopic
};