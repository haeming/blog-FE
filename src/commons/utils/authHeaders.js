export default function getAuthHeaders(){
    const token = localStorage.getItem("token");
    if(!token){
        throw new Error("로그인이 필요합니다.");
    }

    return{
        headers:{
            Authorization: `Bearer ${token}`
        },
        withCredentials: true
    };
}