import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    token: null,
    accountName: null,
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