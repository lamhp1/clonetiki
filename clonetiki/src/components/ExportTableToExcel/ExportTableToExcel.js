import React from 'react';
import { Button } from 'antd';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Dữ liệu mẫu
// const dataSource = [
//     { key: '1', name: 'John', age: 32, address: 'New York' },
//     { key: '2', name: 'Jim', age: 42, address: 'London' },
//     { key: '3', name: 'Jake', age: 22, address: 'San Francisco' },
// ];

// const columns = [
//     { title: 'Name', dataIndex: 'name', key: 'name' },
//     { title: 'Age', dataIndex: 'age', key: 'age' },
//     { title: 'Address', dataIndex: 'address', key: 'address' },
// ];

const ExportTableToExcel = (props) => {
    const { data, typeTable = '' } = props;
    const handleExport = () => {
        // Lấy dữ liệu từ dataSource của Table
        let nameFile = 'table-data.xlsx';
        const dataToExport = data.map((row) => {
            switch (typeTable) {
                case 'userTable':
                    nameFile = 'userTable.xlsx';
                    return {
                        Name: row.name,
                        Email: row.email,
                        Address: row.address,
                        Admin: row.admin,
                        Phone: row.phone,
                        Avatar: row.avatar,
                    };
                case 'productTable':
                    nameFile = 'productTable.xlsx';
                    return {
                        Name: row.name,
                        Type: row.type,
                        Price: row.price,
                        Rating: row.rating,
                        Description: row.description,
                        Image: row.image,
                    };
                case 'ordersTable':
                    nameFile = 'ordersTable.xlsx';
                    return {
                        userName: row.name,
                        phone: row.phone,
                        address: row.address,
                        orderItems: row?.orderItems
                            ?.map((item) => {
                                return `Tên sp: ${item?.name} - số lượng: ${item?.amount} - đơn giá: ${item?.price}`;
                            })
                            .join(','),
                        paymentMethod: row.paymentMethod,
                        deliveryMethod: row.deliveryMethod,
                        shippingPrice: row.shippingPrice,
                        totalPrice: row.totalPrice,
                        isPaid: row.isPaid,
                        paidAt: row.paidAt,
                        isDelevered: row.isDelevered,
                    };
                default:
                    return {};
            }
        });

        // Tạo worksheet từ dữ liệu
        const ws = XLSX.utils.json_to_sheet(dataToExport);

        // Tạo workbook và thêm worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // Xuất file Excel
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        // Lưu file
        const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(file, nameFile);
    };

    return (
        <div>
            <Button onClick={handleExport} style={{ marginBottom: 16 }}>
                Xuất Excel
            </Button>
        </div>
    );
};

export default ExportTableToExcel;
