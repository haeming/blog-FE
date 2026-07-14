import { AUTH_TOKEN_KEY } from "./authStorageKeys.js";

export default function getAuthHeaders(){
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
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