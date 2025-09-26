export default function useEnterSubmit(callback){
    return (e) => {
        if(e.key === "Enter"){
            callback();
        }
    }
}