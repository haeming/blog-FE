import './App.css'
import {BrowserRouter, Routes} from "react-router-dom";
import {AppRouter} from "./routes/AppRouter.jsx";
import {ToastContainer} from "react-toastify";
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { adminApi } from './api/adminApi.js';
import { loginAction } from './store/authSlice.js';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
        if(token){
          try {
            const res = await adminApi.verifyToken();
            const {accountName} = res.data.result;
            dispatch(loginAction({accountName, token}));
          } catch (err){
            console.error(err);
            localStorage.removeItem("token");
            localStorage.removeItem("accountName");
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
