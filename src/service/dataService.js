import { api } from "./api.js";

const endpoints = {
    topicsOfCategory: (categoryId) => `/classes/Posts/?include=author&where={"category":{"__type":"Pointer","className":"Categories","objectId":"${categoryId}"}}`,
    categories: '/classes/Categories/?order=createdAt',
    topic: (topicId) => `/classes/Posts/${topicId}?include=author`
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

export const dataService = {
    getAllCategories,
    getTopics,
    getTopicDetails
};