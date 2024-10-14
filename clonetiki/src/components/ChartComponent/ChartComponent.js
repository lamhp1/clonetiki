import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ConvertDataAmountByDate from './ConvertDataAmountByDate';
import ConvertDataAmountByType from './ConvertDataAmountByType';

// Đăng ký các component của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartComponent = ({ type = '', orders, typeProduct, title, label, ...props }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: { label },
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    });

    const fetchOrderData = async () => {
        try {
            let dataMap = {};

            const TypeOfChart = (type) => {
                switch (type) {
                    case 'amountByDate':
                        return (dataMap = ConvertDataAmountByDate(orders));
                    case 'amountByType':
                        return (dataMap = ConvertDataAmountByType(orders, typeProduct));
                    default:
                        return {};
                }
            };

            TypeOfChart(type);

            const labels = Object.keys(dataMap).slice(-7); // Lấy 7 ngày gần nhất

            const data = Object.values(dataMap).slice(-7); // Dữ liệu số lượng sản phẩm

            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Số lượt mua',
                        data,
                        backgroundColor: 'rgba(75, 192, 192, 0.4)', // Màu nền của cột
                        borderColor: 'rgba(75, 192, 192, 1)', // Màu viền của cột
                        borderWidth: 1,
                    },
                ],
            });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchOrderData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orders, typeProduct]);

    return (
        <div {...props}>
            <h3>{title}</h3>
            <Bar
                data={chartData}
                options={{
                    scales: {
                        y: {
                            beginAtZero: true, // Bắt đầu từ 0
                            ticks: {
                                stepSize: 1, // Khoảng cách giữa các giá trị nhãn
                                callback: function (value) {
                                    if (Number.isInteger(value)) {
                                        return value; // Chỉ hiển thị số nguyên
                                    }
                                },
                            },
                        },
                    },
                }}
            />
        </div>
    );
};

export default ChartComponent;
