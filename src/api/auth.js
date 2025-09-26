import axios from "axios";
import baseURL from "../config/apiBaseUrl";
import { loginAction } from "../store/authSlice";

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
    } catch (error){
        console.error("Login error:", error);
        alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
        throw error;
    }
}