import axios from 'axios';

export const axiosJwt = axios.create();

export const loginUser = async (user) => {
    const res = await axios.post(`${process.env.REACT_APP_URL}/user/sign-in`, user);
    return res.data;
};

export const logoutUser = async () => {
    const res = await axios.post(`${process.env.REACT_APP_URL}/user/sign-out`);
    return res.data;
};

export const signupUser = async (user) => {
    const res = await axios.post(`${process.env.REACT_APP_URL}/user/sign-up`, user);
    return res.data;
};

export const updateInfoUser = async (id, data, accessToken) => {
    const res = await axiosJwt.put(`${process.env.REACT_APP_URL}/user/update-user/${id}`, data, {
        headers: {
            token: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};

export const updateAvatar = async (id, formData, accessToken) => {
    const res = await axiosJwt.put(`${process.env.REACT_APP_URL}/user/update-avatar/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            token: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};

export const detailUser = async (id, accessToken) => {
    const res = await axiosJwt.get(`${process.env.REACT_APP_URL}/user/detail-user/${id}`, {
        headers: {
            token: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};

export const refreshToken = async () => {
    const res = await axios.post(`${process.env.REACT_APP_URL}/user/refresh-token`, {
        withCredentials: true,
    });
    return res.data;
};

export const getAllUser = async (accessToken) => {
    const res = await axiosJwt.get(`${process.env.REACT_APP_URL}/user/getAll`, {
        headers: {
            token: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};

export const deleteUser = async (id, accessToken) => {
    const res = await axiosJwt.delete(`${process.env.REACT_APP_URL}/user/delete-user/${id}`, {
        headers: {
            token: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};

export const deleteManyUser = async (ids, accessToken) => {
    const res = await axiosJwt.post(`${process.env.REACT_APP_URL}/user/delete-many`, ids, {
        headers: {
            token: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};
