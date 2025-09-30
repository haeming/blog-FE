import './App.css'
import {BrowserRouter, Routes} from "react-router-dom";
import {AppRouter} from "./routes/AppRouter.jsx";
import {ToastContainer} from "react-toastify";

function App() {

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
