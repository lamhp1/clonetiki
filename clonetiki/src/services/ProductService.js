import axios from 'axios';

export const axiosJwt = axios.create();

export const getAllProduct = async (search, limit) => {
    let res = {};
    if (search?.length > 0) {
        res = await axios.get(
            `${process.env.REACT_APP_URL}/product/getAll-products?filter=name&filter=${search}&limit=${limit}`,
        );
    } else {
        res = await axios.get(`${process.env.REACT_APP_URL}/product/getAll-products?limit=${limit}`);
    }
    return res.data;
};

export const getProductByType = async (type, limit, page) => {
    const res = await axios.get(
        `${process.env.REACT_APP_URL}/product/getAll-products?filter=type&filter=${type}&limit=${limit}&page=${page}`,
    );
    return res.data;
};

export const getProductByRate = async (rate, limit, page) => {
    const res = await axios.get(
        `${process.env.REACT_APP_URL}/product/getAll-products?filter=rating&filter=${rate}&limit=${limit}&page=${page}`,
    );
    return res.data;
};

export const getProductByPrice = async (price, limit, page) => {
    const res = await axios.get(
        `${process.env.REACT_APP_URL}/product/getAll-products?filter=price&filter=${price[0]}&filter=${price[1]}&limit=${limit}&page=${page}`,
    );
    return res.data;
};

export const createProduct = async (product, accessToken) => {
    const res = await axiosJwt.post(`${process.env.REACT_APP_URL}/product/create-product`, product, {
        headers: {
            token: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};

export const createImageProduct = async (formData, accessToken) => {
    const res = await axiosJwt.post(`${process.env.REACT_APP_URL}/product/create-product-image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            token: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};

export const getDetailProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_URL}/product/get-details/${id}`);
    return res.data;
};

export const updateProduct = async (id, accessToken, data) => {
    const res = await axiosJwt.put(`${process.env.REACT_APP_URL}/product/update-product/${id}`, data, {
        headers: {
            token: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};

export const deleteProduct = async (id, accessToken) => {
    const res = await axios.delete(`${process.env.REACT_APP_URL}/product/delete-product/${id}`, {
        headers: {
            token: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};

export const deleteManyProduct = async (ids, accessToken) => {
    const res = await axiosJwt.post(`${process.env.REACT_APP_URL}/product/delete-many`, ids, {
        headers: {
            token: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};

export const getAllTypeProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_URL}/product/getAll-type-products`);
    return res.data;
};

export const rateProduct = async (id, rate) => {
    const res = await axios.put(`${process.env.REACT_APP_URL}/product/rate-product/${id}`, rate);
    return res.data;
};
