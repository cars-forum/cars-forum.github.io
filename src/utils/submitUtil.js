export function submitHandler(handler) {
    return function (e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        handler(data, e.target);
    }
}

export class FormLocker {
    constructor(formId) {
        this.formId = formId;
        this.inputIds = document.getElementById(formId).querySelectorAll('input,select,textarea,button');
    }

    get formId() {
        return this._formId;
    }

    set formId(val) {
        if (typeof val !== 'string') {
            throw new TypeError('The FormLocker parameter must be a string.');
        }

        if(val.includes(' ')){
            throw new TypeError('The FormLocker parameter must not contain whitespaces.');
        }

        this._formId = val;
    }

    lockForm() {
        this.inputIds.forEach(element => {
            if (element) {
                element.setAttribute('disabled', 'disabled');
            }
        });
    }

    unlockForm() {
        this.inputIds.forEach(element => {
            if (element) {
                element.removeAttribute('disabled');
            }
        });
    }
}