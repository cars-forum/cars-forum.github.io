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

function isOwner(ownerItemId) {
    const userId = getUserData()?._id;
    return userId === ownerItemId;
}

export const user = {
    setUserData,
    getUserData,
    clearUserData,
    getSessionToken,
    isOwner,
};