class Notific {
    constructor(message) {
        this.message = message;
        this.notificationEl = document.createElement('div');
        this.maxNotifics = 3;
    }

    showNotification(sectionId, notifClass) {
        this.notificationEl.textContent = this.message;
        this.notificationEl.classList.add('notific');
        this.notificationEl.classList.add(notifClass);
        this.notificationEl.addEventListener('click', (e) => e.currentTarget.remove());

        const section = document.getElementById(sectionId);
        section.prepend(this.notificationEl);

        const notificsCollection = section.querySelectorAll('.notific');
        const notificsLength = notificsCollection.length;
        const isFullOf = notificsLength > this.maxNotifics;

        if (isFullOf) {
            notificsCollection[notificsLength - 1].remove();
        }
    }

    removeNotification() {
        this.notificationEl.remove();
    }
}

class ErrorNotific extends Notific {
    constructor(message) {
        super(message);
        this.notifClass = 'error-notific';
    }

    showNotificIn(sectionId) {
        this.showNotification(sectionId, this.notifClass);
    }
}

class SuccessNotific extends Notific {
    constructor(message) {
        super(message);
        this.notifClass = 'success-notific';
    }

    showNotificIn(sectionId) {
        this.showNotification(sectionId, this.notifClass);
        setTimeout(() => this.removeNotification(), 6000);
    }
}

export {
    ErrorNotific,
    SuccessNotific
};