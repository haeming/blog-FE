import { useNavigate } from "react-router-dom";

export default function usePageService(){

    const navigate = useNavigate();

    const goToBack = () => {
        navigate(-1);
    }

    const goToHome = () => {
        navigate("/");
    }

    const goToCategory = () => {
        navigate("/category");
    }

    return { goToBack, goToHome, goToCategory };
}