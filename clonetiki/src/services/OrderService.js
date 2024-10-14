import axios from 'axios';

export const axiosJwt = axios.create();

export const createOrder = async (idUser, data, accessToken) => {
    const res = await axiosJwt.post(`${process.env.REACT_APP_URL}/order/create-order/${idUser}`, data, {
        headers: {
            token: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};

export const getDetailOrder = async (id, accessToken) => {
    const res = await axiosJwt.get(`${process.env.REACT_APP_URL}/order/get-detail-order/${id}`, {
        headers: {
            token: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};

export const deleteOrder = async (idUser, orderDelete, accessToken) => {
    const res = await axiosJwt.post(`${process.env.REACT_APP_URL}/order/delete-order/${idUser}`, orderDelete, {
        headers: {
            token: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};

export const deleteManyOrder = async (ids, accessToken) => {
    const res = await axiosJwt.post(`${process.env.REACT_APP_URL}/order/delete-many-order`, ids, {
        headers: {
            token: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};

export const getAllOrders = async (accessToken) => {
    const res = await axiosJwt.get(`${process.env.REACT_APP_URL}/order/get-all-orders`, {
        headers: {
            token: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};
