import useCategory from "../../api/category.js";
import {useEffect, useState} from "react";

export default function useCategoryData (){
    const categoryApi = useCategory();
    const [categories, setCategories] = useState([]);

    const categoryData = async () => {
        try {
            const res = await categoryApi.getCategoryList();
            setCategories(res);
        } catch (error){
            console.error(error);
        }
    };

    useEffect(() => {
        categoryData();
    },[])


    return {categories}
}