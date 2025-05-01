import { useEffect, useState } from "react";
import { useLazyGetCategoryQuery } from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { CategoryList, CategoryListResponse } from "@/types/community";

export const useCategoryList = (type = "content") => {
  const [categoryList, setCategoryList] = useState<CategoryList[]>([]);
  const [loading, setLoading] = useState(true);
  const [getCategory] = useLazyGetCategoryQuery<CategoryListResponse>();

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const categoryResponse = await getCategory({
          endpoint: `${API_CONSTANTS.GET_CATEGORY_LIST}?type=${type}`,
        }).unwrap();

        setCategoryList(
          categoryResponse?.data?.map(({ category_id, name, color }) => ({
            category_id,
            name,
            color,
          })) || []
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategoryList([]); // Reset list on failure
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [getCategory, type]);

  return { categoryList, loading };
};
