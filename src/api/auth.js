import axios from "axios";
import baseURL from "../config/apiBaseUrl";
import {loginAction, logoutAction} from "../store/authSlice";
import {toast} from "react-toastify";

export const login = ({ accountName, password }) => async(dispatch) => {
    try {
        const response = await axios.post(`${baseURL}/api/admin/login`, {
            accountName,
            password
        })
        const data = response.data;
        localStorage.setItem("token", data.token);
        localStorage.setItem("accountName", data.accountName);
        dispatch(loginAction(data));
        toast.success("환영합니다!");
    } catch (error){
        if(error.response){
            const backendMessage = error.response.data.message;
            toast.error(backendMessage || "로그인 중 오류가 발생했습니다.");
        } else {
            alert("서버와 통신할 수 없습니다. 잠시 후 다시 시도해주세요.")
        }
        console.error("Login error:", error);
        throw error;
    }
}

export const logout = () => (dispatch) => {
    try{
        localStorage.removeItem("token");
        localStorage.removeItem("accountName");
        dispatch(logoutAction());
    } catch (error){
        console.error("logout error:", error);
    }
}