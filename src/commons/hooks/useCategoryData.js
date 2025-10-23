import useCategory from "../../api/categoryApi.js";
import {useEffect, useState} from "react";

export default function useCategoryData (){
    const categoryApi = useCategory();
    const [categories, setCategories] = useState([]);

    const categoryData = async () => {
        try {
            const categoryList = await categoryApi.getCategoryList();
            console.log(categoryList);
            const categoriesWithCount = await Promise.all(
                categoryList.map(async (category) => {
                    try {
                        const countRes = await categoryApi.getPostCountByCategoryId(category.id);
                        const postCount = countRes.result;
                        return { ...category, postCount };
                    } catch (error) {
                        console.error("postCount Error", error);
                        return { ...category, postCount: 0 };
                    }
                })
            );
            setCategories(categoriesWithCount);
        } catch (error){
            console.error(error);
        }
    };

    useEffect(() => {
        categoryData();
    },[])


    return {categories, categoryData};
}