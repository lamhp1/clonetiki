function ConvertDataAmountByDate(orders) {
    const dateMap = {};
    const listDate = [];

    const currentDate = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(currentDate.getDate() - i);
        listDate.push(date.toLocaleDateString('vi-VN'));
    }

    for (let day of listDate) {
        dateMap[day] = 0;
    }

    orders?.forEach((order) => {
        const date = new Date(order.createdAt).toLocaleDateString('vi-VN'); // Lấy ngày từ `createdAt`

        // if (!dateMap[date]) {
        //     dateMap[date] = 0;
        // }

        // Cộng tổng số lượng sản phẩm trong đơn hàng
        if(listDate?.some(item => item === date)) {
            order.orderItems.forEach((item) => {
                dateMap[date] += item.amount;
            });
        }
       
    });

    return dateMap;
}

export default ConvertDataAmountByDate;
