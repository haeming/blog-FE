import {Route, Routes} from "react-router-dom";
import {useSelector} from "react-redux";
import Home from "../pages/Home.jsx";
import LoginPage from "../pages/LoginPage.jsx";

export function AppRouter(){

    const authInfo = useSelector(state => state.auth);

    return(
        <Routes>
            <Route path="/" element={
                authInfo && authInfo.token ? (
                    <Home/>
                ) : (
                    <LoginPage/>
                )
            } />
        </Routes>
    )
}