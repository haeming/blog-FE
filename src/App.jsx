import './App.css'
import {BrowserRouter, Routes} from "react-router-dom";
import {AppRouter} from "./routes/AppRouter.jsx";

function App() {

  return (
    <>
      <BrowserRouter>
          <AppRouter/>
      </BrowserRouter>
    </>
  )
}

export default App
