import {Route, Routes} from "react-router-dom";
import {useSelector} from "react-redux";
import Home from "../pages/Home.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import Layout from "../components/Layout.jsx";
import CategoryManagement from "../pages/CategoryManagement.jsx";
import PostCreate from "../pages/PostCreate.jsx";
import PostDetail from "../pages/PostDetail.jsx";
import PostList from "../pages/PostList.jsx";

export function AppRouter(){

    const authInfo = useSelector(state => state.auth);

    return(
        <Routes>
            {authInfo && authInfo.token ? (
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/category" element={<CategoryManagement />} />
                    <Route path="/post/write" element={<PostCreate/>} />
                    <Route path="/post/:id" element={<PostDetail/>} />
                    <Route path="/post/list" element={<PostList/>} />
                </Route>
            ) : (
                <Route path="*" element={<LoginPage />} />
            )}
        </Routes>
    )
}