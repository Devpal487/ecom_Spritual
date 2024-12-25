import axios from 'axios';
import api, { ChatBot_URL_Onload, HOST_URL,previewpath } from './config'; 


export const getItemContentType = async () => {
    try {
        const response = await axios.post(`${HOST_URL}TypeOfContentControllers/GetTypeOfContentE_Comm`, { id: -1 });
        return response.data;
    } catch (error) {
        console.error("Error fetching content type:", error);
        throw error;
    }
};

export const getCommDigitalContent = async (id,contentTypeId, categoryId) => {
    try {
        const response = await axios.post(`${HOST_URL}E_CommDigitalContent/GeteCommDigitalContent`, { id: id, contentTypeId:contentTypeId, categoryId:categoryId });
        return response.data;
    } catch (error) {
        // console.error("Error fetching content type:", error);
        throw error;
    }
};

export const getAddUpdateAddToCart = async (cartItem) => {
    const initialValues = {
        cartId:cartItem.cartId || -1,
        contentId: cartItem.contentId || 0,
        quantity: cartItem.quantity || 1,
        userId: cartItem.userId || "", 
        updatedOn: new Date().toISOString(), 
        createdOn: new Date().toISOString(),
        title: cartItem.title || "string",
        thumbnail: cartItem.thumbnail || "string", 
        exRate: cartItem.exRate || 0 
    };

    try {
        const response = await axios.post(`${HOST_URL}AddToCart/AddUpdateAddToCart`, initialValues);
        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error; 
    }
};

export const DecreaseAddToCart = async (cartItem) => {
    const initialValues = {
        cartId: cartItem.cartId,
        contentId: cartItem.contentId || 0,
        quantity: cartItem.quantity || 1,
        userId: cartItem.userId || "", 
        updatedOn: new Date().toISOString(), 
        createdOn: new Date().toISOString(),
        title: cartItem.title || "",
        thumbnail: cartItem.thumbnail || "", 
        exRate: cartItem.exRate || 0 
    };

    try {
        const response = await axios.post(`${HOST_URL}AddToCart/DecreaseAddToCart`, initialValues);
        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error; 
    }
};

export const getFilePreview = async (fileName) => {
    try {
        const response = (`${previewpath}`, { fileName });
        return response.data;
    } catch (error) {
        console.error("Error fetching content type:", error);
        throw error;
    }
};

export const getWishlistData = async (id) => {
    // console.log("getWishlistData ~ id:", id)
    try {
        // if (unmeValue) {
            const response = await axios.get(`${HOST_URL}Admin2/GetDigitalWishListContents`,{headers:{UniqueId:id}});
            return response.data;
        // }
    } catch (error) {
        console.error("Error fetching content type:", error);
        throw error;
    }
};

export const getAddtoCart = async (unmeValue) => {
    try {
        const collectData ={
            "userId":unmeValue
        }
        // console.log("🚀 ~ getAddtoCart ~ collectData:", collectData)
        const response = await  axios.post(`${HOST_URL}AddToCart/GetAddToCart`,collectData);
        // console.log("🚀 ~ getAddtoCart ~ response:", response)
        return response.data;
    } catch (error) {
        // console.error("Error fetching content type:", error);
        throw error;
    }
};

export const DeleteAddToCart = async (cartid) => {
    try {
        const collectData ={
             "cartId":cartid
        }
        const response = await axios.delete(`${HOST_URL}AddToCart/DeleteAddToCart`,{ 
            headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        },
        data:collectData
    });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const saveWishListData = async (unid, initialValues) => {
    try {
        const response = await axios.post(`${HOST_URL}DigitalOperate/SaveDigitalWishList`,initialValues,{ 
            headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'UniqueId':unid
        },
    });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAddUpdateOrderItem = async (collectData) => {
    try {
        const response = await axios.post(`${HOST_URL}OrderItem/AddUpdateOrderItem`,collectData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAddUpdateUserRegistration = async (collectData) => {
    try {
        const response = await axios.post(`${HOST_URL}ECommRegistration/AddUpdateECommRegitration`,collectData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetReactCategory = async () => {
    try {
        const response = await axios.get(`${HOST_URL}E_CommDigitalContent/GetReactCategory`,{params:{id:-1}});
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetOrderItem = async (orderId, userId) => {
    try {
        const response = await axios.post(`${HOST_URL}OrderItem/GetOrderItem`,{
            "orderId": orderId,
            "userId": userId
          });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetOrderItemFile = async (orderId, userId) => {
    try {
        const response = await axios.post(`${HOST_URL}OrderItem/GetOrderItem`,{
            "orderId": orderId,
            "userId": userId,
            "show": false,
             "exportOption": ".pdf"
          });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const AddUpdateThemeMaster = async (initialValues,uniqueId) => {
    try {
        const response = await api.post(`ThemeMaster/AddUpdateThemeMaster`, initialValues);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetThemeMaster = async (initialValues,uniqueId) => {
    try {
        const response = await axios.post(`${HOST_URL}ThemeMaster/GetThemeMasterE_Comm`, initialValues);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetSettingMaster = async () => {
    try {
        const response = await axios.post(`${HOST_URL}SettingMaster/GetSettingMaster`, {"settingId": -1});
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetDigitalFiles = async (fileId, id) => {
    try {
        const response = await axios.get(`${HOST_URL}DigitalOperate/GetDigitalFiles`, {
            params: { digicontentid: fileId },
            headers: { UniqueId: id }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

//initialValue: {"countryId": -1}
export const fetchCountry = async (initialValue) =>{
    try{
        const response = await axios.post(`${HOST_URL}Country/GetCountryMaster`, initialValue)
        return response.data
    } catch(error){
        throw error;
    }
};

//initialValue: {"stateId": -1,"countryId": -1}             
export const fetchState = async (initialValue) =>{
    try{
        const response = await axios.post(`${HOST_URL}StateMaster/GetStateMaster`,initialValue)
        return response.data
    } catch(error){
        throw error;
    }
};

//initialValue: {"districtId": 0,"stateId": 0,"divisionId": 0}         
export const fetchcity = async (initialValue) =>{
    try{
        const response = await axios.post(`${HOST_URL}DistrictMaster/GetDistrictMaster`,initialValue)
        return response.data
    } catch(error){
        throw error;
    }
};
//initialValue: {"stateId": 0,"divisionId": 0}         
export const fetchdivision = async (initialValue) =>{
    try{
        const response = await axios.post(`${HOST_URL}DivisionMaster/GetDivisionMaster`,initialValue)
        return response.data
    } catch(error){
        throw error;
    }
};

export const fetchAddresswithunid = async (id) =>{
    try{
        const response = await axios.post(`${HOST_URL}ECommRegistration/GetECommRegitration?userid=${id}`)
        return response.data
    } catch(error){
        throw error;
    }
};

export const fetchAddress = async (id) =>{
    try{
        const response = await api.post(`/ECommRegistration/GetECommRegitration?UserId=${id}`)
        return response.data
    } catch(error){
        throw error;
    }
};

export const AddUpdateMemberPatron = async (updatedUserData,address) =>{
    try{
        const response = await api.get(`/CircUser/AddUpdateCircUser`,{circUser:updatedUserData, address:address})
        return response.data
    } catch(error){
        throw error;
    }
};

export const GetContentDescription = async (id1,id2) =>{
    try{
        const collectData ={id:id1, contentTypeId:id2}
        const response = await api.post(`/ContentDescription/GetContentDescription`, collectData)
        return response.data
    } catch(error){
        throw error;
    }
};

//Poster/GetPosterEcomm


export const fetchposterData = async (id) =>{
    try{
        const response = await axios.post(`${HOST_URL}Poster/GetPosterEcomm`,{posterId:id})
        return response.data
    } catch(error){
        throw error;
    }
};

export const onLoadData = async (id) =>{
    try{
        const response = await axios.get(`${ChatBot_URL_Onload}`)
        return response.data
    } catch(error){
        throw error;
    }
};