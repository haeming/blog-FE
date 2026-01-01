import './App.css'
import 'react-toastify/dist/ReactToastify.css';
import {BrowserRouter, Routes} from "react-router-dom";
import {AppRouter} from "./routes/AppRouter.jsx";
import {ToastContainer} from "react-toastify";
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { adminApi } from './api/adminApi.js';
import { loginAction, logoutAction } from './store/authSlice.js';
import {visitApi} from "./api/visitApi.js";

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const pingVisit = async () => {
      const now = new Date();
      const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
      const today = kst.toISOString().slice(0, 10); // yyyy-mm-dd

      const key = "uv_ping_date";
      if(sessionStorage.getItem(key) === today) return;
      sessionStorage.setItem(key, today);

      try{
        await visitApi.ping();
      } catch (error){
        console.debug("visit ping failed", error);
      }
    }

    pingVisit();
  }, []);

  // 토큰 검증
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if(!token){
        dispatch(logoutAction());
        return
      }

      try {
        const res = await adminApi.verifyToken();
        const accountName = res.accountName;

        dispatch(loginAction({accountName, token}));
      } catch (err){
        console.error("토큰 검증 실패", err);

        localStorage.removeItem("token");
        localStorage.removeItem("accountName");
        dispatch(logoutAction()); // 실패 시에도 로그아웃 처리
      }
    };

    checkToken();
  }, [dispatch]);

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
