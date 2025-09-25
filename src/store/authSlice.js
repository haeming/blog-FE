import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated : false,
    token : null,
    admin : null
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginAction: (state, action) => {
            const { token, admin } = action.payload;
            state.isAuthenticated = true;
            state.token = token;
            state.admin = admin;
        },
        logoutAction: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.admin = null;
        }
    }
});

export const { loginAction, logoutAction} = authSlice.actions;
export default authSlice.reducer;