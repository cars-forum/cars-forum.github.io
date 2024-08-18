export function submitHandler(handler) {
    return function(e){
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        handler(data, e.target);
    }
}

export class FormLocker{
    constructor(inputIdsArr){
        this.inputIds = inputIdsArr;
    }

    get inputIds(){
        return this._inputIds;
    }

    set inputIds(val){
        if(Array.isArray(val)){
            this._inputIds = val;
            return;
        }

        throw new TypeError('FormLocker parameter must be an array.');
    }

    lockForm(){
        this.inputIds.forEach(id => {
            document.getElementById(id).setAttribute('disabled','disabled');
        });
    }

    unlockForm(){
        this.inputIds.forEach(id => {
            document.getElementById(id).removeAttribute('disabled');
        });
    }
}