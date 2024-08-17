import { api } from "./api.js";

const endpoints = {
    topicsOfCategory: (categoryId) => `/classes/Posts/?include=author&where={"category":{"__type":"Pointer","className":"Categories","objectId":"${categoryId}"}}`,
    categories: '/classes/Categories/?order=createdAt'
}

async function getAllCategories() {
    const result = await api.get(endpoints.categories);
    return result.results;
}

async function getTopics(categoryId) {
    const result = await api.get(endpoints.topicsOfCategory(categoryId));
    return result.results;
}

export const dataService = {
    getAllCategories,
    getTopics
};