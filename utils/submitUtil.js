export function submitHandler(handler) {
    return function(e){
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        handler(data, e.target);
    }
}