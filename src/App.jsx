import './App.css'
import {BrowserRouter, Routes} from "react-router-dom";
import {AppRouter} from "./routes/AppRouter.jsx";
import {ToastContainer} from "react-toastify";
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { adminApi } from './api/adminApi.js';
import { loginAction } from './store/authSlice.js';
import usePageService from './commons/hooks/useNavigationService.js';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
        if(token){
          try {
            const res = await adminApi.verifyToken();
            const {accountName} = res.result.accountName;
            dispatch(loginAction({accountName, token}));
          } catch (err){
            console.error("토큰 검증 실패", err);
            localStorage.removeItem("token");
            localStorage.removeItem("accountName");
            usePageService().goToHome();
          }

        }
    }
    checkToken();

  }, [dispatch])

  return (
    <>
        <ToastContainer
            position="bottom-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
        />
      <BrowserRouter>
          <AppRouter/>
      </BrowserRouter>
    </>
  )
}

export default App
