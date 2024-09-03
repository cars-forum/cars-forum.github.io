import { api } from "./api.js";

const endpoints = {
    topicsOfCategory: (categoryId) => `/classes/Posts/?include=author&where={"category":{"__type":"Pointer","className":"Categories","objectId":"${categoryId}"}}`,
    categories: '/classes/Categories/?order=isLast,createdAt',
    categoriesNoLast: '/classes/Categories/?where={"isLast":false}&order=createdAt',
    topic: (topicId) => `/classes/Posts/${topicId}?include=author,author.role`,
    creatingPost: '/classes/Posts',
    creatingReply: '/classes/Replies',
    creatingCategory: '/classes/Categories',
    allRepliesOfPost: (postId) => `/classes/Replies?where={"post":{"__type":"Pointer","className":"Posts","objectId":"${postId}"}}&include=author,author.role`,
    changeTopic: (postId) => `/classes/Posts/${postId}`,
    reply: (replyId) => `/classes/Replies/${replyId}?include=post`,
    changeReply: (replyId) => `/classes/Replies/${replyId}`,
    allBrands: '/classes/Brands',
    postsCount: (userId) => `/classes/Posts?where={"author":{"__type":"Pointer","className":"_User","objectId":"${userId}"}}&count=1&limit=0`,
    repliesCount: (userId) => `/classes/Replies?where={"author":{"__type":"Pointer","className":"_User","objectId":"${userId}"}}&count=1&limit=0`,
    ban: '/classes/Bans',
    banChecker: (userId) => `/classes/Bans?where={"user":{"__type":"Pointer","className":"_User","objectId":"${userId}"}}&order=-expiresOn&limit=1`
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

async function createNewTopic(title, content, authorId, categoryId, videoUrl) {
    if (videoUrl) {
        return await api.post(endpoints.creatingPost, {
            title,
            content,
            author: { "__type": "Pointer", "className": "_User", "objectId": authorId },
            category: { "__type": "Pointer", "className": "Categories", "objectId": categoryId },
            videoUrl
        });
    }

    return await api.post(endpoints.creatingPost, {
        title,
        content,
        author: { "__type": "Pointer", "className": "_User", "objectId": authorId },
        category: { "__type": "Pointer", "className": "Categories", "objectId": categoryId }
    });
}

async function addNewReply(content, authorId, postId, videoUrl) {
    if (videoUrl) {
        return await api.post(endpoints.creatingReply, {
            content,
            "author": { "__type": "Pointer", "className": "_User", "objectId": authorId },
            "post": { "__type": "Pointer", "className": "Posts", "objectId": postId },
            videoUrl
        });
    }

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

async function getAllBrands() {
    const result = await api.get(endpoints.allBrands);
    return result.results
}

async function getUserRepliesCount(userId) {
    const postsQuery = api.get(endpoints.postsCount(userId));
    const repliesQuery = api.get(endpoints.repliesCount(userId));
    const [postsResponse, repliesResponse] = await Promise.all([postsQuery, repliesQuery]);
    return postsResponse.count + repliesResponse.count;
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

async function deleteReply(replyId) {
    return await api.del(endpoints.changeReply(replyId));
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
    archiveTopic,
    getAllBrands,
    getUserRepliesCount,
    banUser,
    isActiveBan,
    getBanInfo,
    deleteReply
};

const topicService = {
    getTopics,
    getTopicDetails,
    createNewTopic,
    changeTopicLockingState,
    editTopic,
    archiveTopic
};

const categoryService = {
    getAllCategories,
    createNewCategory
};

const replyService = {
    addNewReply,
    getAllReplies,
    getReplyDetails,
    editReply,
    deleteReply
};

const commonDataService = {
    getAllBrands,
    getUserRepliesCount
};