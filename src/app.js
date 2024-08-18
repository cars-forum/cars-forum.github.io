import page from '@page/page.mjs';

import { addRender } from './middleware/render.js';
import { addRedirect } from './middleware/redirect.js';
import { addNavControl, updateNav } from './middleware/navigation.js';

import { showLoginView } from './views/loginView.js';
import { addSessionControl } from './middleware/session.js';
import { showHomeView } from './views/homeView.js';
import { showRegisterView } from './views/registerView.js';
import { showTopicView } from './views/topicView.js';
import { showCreateTopicView } from './views/createTopicView.js';

const root = document.querySelector('main');

if (!root) {
    throw new ReferenceError('Document has no valid root!');
}

page(addRender(root));
page(addRedirect());
page(addNavControl());
page(addSessionControl());
page('/', showHomeView);
page('/register', showRegisterView);
page('/login', showLoginView);
page('/topic/:id', showTopicView);
page('/create-topic', showCreateTopicView);

page.start();

updateNav();