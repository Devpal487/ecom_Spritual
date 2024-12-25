import React, { useEffect, useState } from "react";
import { useTheme } from "../../utils/Provider/ThemeContext";
import { getCommDigitalContent, GetReactCategory } from "../../utils/APIURL";
import { previewpath } from "../../utils/config";
import { useNavigate } from "react-router-dom";


const IndexHeader = ({ isActiveCategory }) => {
    const themeMaster = useTheme();
    const navigate = useNavigate();
    const [categoryData, setCategoryData] = useState([]);
    
    useEffect(() => {
        if (isActiveCategory) {
            fetchReactCategoryData();
        }
    }, [isActiveCategory]);

    const fetchReactCategoryData = async () => {
        const response = await GetReactCategory();
        if (response.data.length > 0) {
            const filteredData = response.data
            const updatedBooks = filteredData.map((book) => ({
                ...book,
                itemcategimg: book.itemcategimg ? `${previewpath}${book.itemcategimg}` : ``
            }));
            setCategoryData(updatedBooks)
        } else {
            setCategoryData([]);
        }
    }

    const fetchDatabyCategory = async(id) => {
        console.log("categoryLoadStatus", id)
        let result = await getCommDigitalContent(-1,0,id?.id);
        console.log("result.data", result?.data)
        let title = result?.data;
        navigate(`/${id?.id}`, {state:{ title, categoryLoadStatus: id?.category_LoadingStatus } });
    }

    return (
        <div style={{ backgroundColor: themeMaster.theme.navbarBackgroundColor, color: themeMaster?.theme?.navbarTextColor }}>
            <div
                id="headerno-3" style={{ backgroundColor: themeMaster.theme.navbarBackgroundColor, color: themeMaster?.theme?.navbarTextColor }}
                className="{ flex flex-start items-end justify-end overflow-x-auto whitespace-nowrap"
            >
                {categoryData?.map((item) => (
                    <div key={item.id} className="flex flex-col items-center mx-2 w-20 md:w-28 lg:w-24">
                        <img src={item.itemcategimg} alt={item.category_LoadingStatus} className=" rounded-full w-10 h-10 md:h-10 lg:h-10 mb-1" />
                        <a
                            className="text-xs md:text-sm lg:text-base hover:underline hover:cursor-pointer text-center overflow-hidden whitespace-nowrap text-ellipsis w-full"
                            onClick={(e)=> fetchDatabyCategory(item)}
                        >
                            {item.category_LoadingStatus}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default IndexHeader;