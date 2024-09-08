class Notific {
    constructor(message) {
        this.message = message;
        this.notificationEl = document.createElement('div');
    }

    showNotification(sectionId, notifClass) {
        this.notificationEl.textContent = this.message;
        this.notificationEl.classList.add(notifClass);
        this.notificationEl.addEventListener('click', (e) => e.currentTarget.remove());

        const section = document.getElementById(sectionId);
        section.prepend(this.notificationEl);
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

    showNotific(sectionId) {
        this.showNotification(sectionId, this.notifClass);
    }
}

class SuccessNotific extends Notific {
    constructor(message) {
        super(message);
        this.notifClass = 'success-notific';
    }

    showNotific(sectionId) {
        this.showNotification(sectionId, this.notifClass);
        setTimeout(() => this.removeNotification(), 6000);
    }
}

export {
    ErrorNotific,
    SuccessNotific
};