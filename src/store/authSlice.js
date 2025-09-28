import {createSlice} from "@reduxjs/toolkit";

const token = localStorage.getItem("token");
const accountName = localStorage.getItem("accountName");

const initialState = {
    // token이 존재하면 true, 없으면 false
    isAuthenticated : !!token, 
    token : token,
    accountName : accountName
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginAction: (state, action) => {
            const { token, accountName } = action.payload;
            state.isAuthenticated = true;
            state.token = token;
            state.accountName = accountName;
        },
        logoutAction: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.accountName = null;
        }
    }
});

export const { loginAction, logoutAction} = authSlice.actions;
export default authSlice.reducer;