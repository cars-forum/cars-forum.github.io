import { user } from "../utils/userUtils.js";

const navButtons = document.querySelectorAll('nav .button');
const hoverInfo = document.querySelector('.hover-button-info');
const username = user.getUserData()?.username;

const buttonsTitle = {
    homeButton: 'Home',
    profileButton: `Welcome, ${username}`,
    loginButton: 'Login',
    registerButton: 'Register',
    logoutButton: 'Logout',
}

navButtons.forEach(element => {
    element.addEventListener('mouseover', showNavText);
    element.addEventListener('mouseout', hideNavText);
});

function showNavText(e) {
    const currentTargetId = e.currentTarget.id;

    hoverInfo.textContent = buttonsTitle[currentTargetId];
    hoverInfo.style.opacity = '1';
}

function hideNavText(e) {
    hoverInfo.style.opacity = '0';
}