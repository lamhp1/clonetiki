function ConvertDataAmountByType(orders, typeProduct) {
    const dataMap = {};

    for (let type of typeProduct) {
        dataMap[type] = 0;
    }

    orders?.forEach((order) => {
        order?.orderItems?.forEach((item) => {
            dataMap[item.type] += item.amount;
        });
    });

    return dataMap;
}

export default ConvertDataAmountByType;
