import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orderItems: [],
    orderItemsSelected: [],
    shippingAddress: {},
    paymentMethod: '',
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt: '',
    isDelevered: false,
    deleveredAt: '',
};

export const orderSlide = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrder: (state, action) => {
            const { orderPayload } = action.payload;
            const checkProduct = state?.orderItems?.find((item) => item?.product === orderPayload?.product);
            if (checkProduct) {
                if ((checkProduct.amount += orderPayload.amount) <= checkProduct.countInStock) {
                    checkProduct.amount += 0;
                } else {
                    checkProduct.amount = checkProduct.countInStock;
                }
            } else {
                state.orderItems.push(orderPayload);
            }
        },
        increaseAmount: (state, action) => {
            const { idProduct } = action.payload;
            const checkProduct = state?.orderItems?.find((item) => item?.product === idProduct);
            checkProduct.amount++;
            const checkProductSelected = state?.orderItemsSelected?.find((item) => item?.product === idProduct);
            if (checkProductSelected) {
                checkProductSelected.amount++;
            }
        },
        decreaseAmount: (state, action) => {
            const { idProduct } = action.payload;
            const checkProduct = state?.orderItems?.find((item) => item?.product === idProduct);
            checkProduct.amount--;
            const checkProductSelected = state?.orderItemsSelected?.find((item) => item?.product === idProduct);
            if (checkProductSelected) {
                checkProductSelected.amount--;
            }
        },
        removeOrder: (state, action) => {
            const { idProduct } = action.payload;
            const checkProduct = state?.orderItems?.filter((item) => item?.product !== idProduct);
            state.orderItems = checkProduct;
            const checkProductSelected = state?.orderItemsSelected?.filter((item) => item?.product !== idProduct);
            state.orderItemsSelected = checkProductSelected;
        },
        removeOderAll: (state, action) => {
            state.orderItems = [];
            state.orderItemsSelected = [];
        },
        orderSelected: (state, action) => {
            const { checkListId } = action.payload;
            const orderSelected = state?.orderItems.filter((item1) =>
                checkListId.some((item2) => item1.product === item2),
            );
            state.orderItemsSelected = orderSelected;
        },
        removeOrderSuccess: (state, action) => {
            const { checkListId } = action.payload;
            state.orderItemsSelected = [];
            const checkProduct = state?.orderItems.filter((item) => !checkListId?.includes(item?.product));
            state.orderItems = checkProduct;
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    addOrder,
    increaseAmount,
    decreaseAmount,
    removeOrder,
    removeOderAll,
    orderSelected,
    removeOrderSuccess,
} = orderSlide.actions;

export default orderSlide.reducer;
