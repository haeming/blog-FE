export default function useDateFormat(){
    const formatDateTime = (dateString) => {
        if(!dateString){
            return "";
        }

        const formatted = new Date(dateString)
            .toLocaleString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            }).replace(/-/g, '.');

        return formatted;
    };

    return { formatDateTime };
}