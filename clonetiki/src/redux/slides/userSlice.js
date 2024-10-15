import { createSlice } from '@reduxjs/toolkit';
import avatarDefault from '~/assets/img/avatardefault.png'

const initialState = {
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: avatarDefault,
    accessToken: '',
    isAdmin: false,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const {
                id = '',
                _id = '',
                name = '',
                email = '',
                phone = '',
                address = '',
                avatar = avatarDefault,
                accessToken = '',
                isAdmin,
            } = action.payload;
            // console.log('payload', action.payload);
            state.id = _id || id;
            state.name = name;
            state.email = email;
            state.phone = phone;
            state.address = address;
            state.avatar = avatar;
            state.accessToken = accessToken;
            state.isAdmin = isAdmin;
        },
        resetUser: (state) => {
            state.name = '';
            state.email = '';
            state.phone = '';
            state.address = '';
            state.avatar = '';
            state.accessToken = '';
            state.isAdmin = false;
        },
    },
});

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
