import { useQuery } from '@tanstack/react-query';
import { deleteManyOrder, getAllOrders } from '~/services/OrderService';
import ExportTableToExcel from '../ExportTableToExcel/ExportTableToExcel';
import TableComponent from '../TableComponent/TableComponent';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './AdminOrders.module.scss';
import { Input, Space, Button as ButtonAntd, Image, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useSelector } from 'react-redux';
import { useMutationHook } from '~/hooks/useMutationHook';
import * as Message from '~/components/Message/Message';
import ChartComponent from '../ChartComponent/ChartComponent';
import { getAllTypeProduct } from '~/services/ProductService';

const cx = classNames.bind(styles);

function AdminOrders() {
    const user = useSelector((state) => state.user);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [typeProduct, setTypeProduct] = useState([]);

    const searchInput = useRef(null);

    const mutationDeleteOrder = useMutationHook((ids) => deleteManyOrder(ids, user?.accessToken));

    const { isSuccess: isSuccessDelete, isError: isErrorDelete } = mutationDeleteOrder;

    useEffect(() => {
        if (isSuccessDelete) {
            Message.successMessage('Xóa thành công');
        } else if (isErrorDelete) {
            Message.errorMessage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessDelete, isErrorDelete]);

    const fetchGetAllOrders = async () => {
        const res = await getAllOrders(user?.accessToken);
        return res.data;
    };

    const {
        isPending,
        data: orders,
        refetch,
    } = useQuery({
        queryKey: ['orders'],
        queryFn: fetchGetAllOrders,
    });

    //fetch all type
    const fetchAllTypeProduct = async () => {
        const res = await getAllTypeProduct();
        if (res?.status === 'OK') {
            setTypeProduct(res?.data);
        }
    };

    useEffect(() => {
        fetchAllTypeProduct();
    }, []);

    const handleDeleteMany = (ids) => {
        if (ids) {
            mutationDeleteOrder.mutate(
                { ids },
                {
                    onSuccess: () => {
                        refetch();
                    },
                },
            );
        }
    };

    //search column name
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <ButtonAntd
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </ButtonAntd>
                    <ButtonAntd
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </ButtonAntd>
                    <ButtonAntd
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </ButtonAntd>
                    <ButtonAntd
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </ButtonAntd>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    // end search column name

    const columns = [
        {
            title: 'User name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('address'),
        },
        {
            title: 'Paid',
            dataIndex: 'isPaid',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Shipped',
            dataIndex: 'isDelevered',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },

        {
            title: 'Payment method',
            dataIndex: 'paymentMethod',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
    ];

    const expandColumns = [
        {
            title: 'Product image',
            dataIndex: 'image',
            render: (text, record) => (
                <Image src={record.image} alt={record.name} style={{ objectFit: 'cover' }} width={50} height={50} />
            ), // Render ảnh trong cột "Hình ảnh"
        },
        {
            title: 'Product Name',
            dataIndex: 'productName',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
        },
        {
            title: 'Price',
            dataIndex: 'price',
        },
    ];

    const data = orders?.map((order) => {
        return {
            ...order,
            key: order?._id,
            name: order.shippingAddress.fullName,
            phone: order.shippingAddress.phone,
            address: order.shippingAddress.address,
            isPaid: order.isPaid ? 'True' : 'False',
            isDelevered: order.isDelevered ? 'True' : 'False',
            expandedData: order?.orderItems?.map((item) => {
                return {
                    key: item?.product,
                    image: item?.image,
                    productName: item?.name,
                    amount: item?.amount,
                    price: item?.price,
                };
            }),
        };
    });

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('header')}>Quản lí đơn hàng</h2>
            <div style={{ display: 'flex', gap: '30px' }}>
                <ChartComponent
                    type="amountByDate"
                    orders={orders}
                    title="Số lượt mua trong 7 ngày gần nhất"
                    label="Số lượt mua"
                    style={{ width: '50%', marginBottom: '20px' }}
                />
                <ChartComponent
                    type="amountByType"
                    orders={orders}
                    typeProduct={typeProduct}
                    title="Số lượt mua theo từng nhãn hiệu"
                    label="Số lượt mua"
                    style={{ width: '50%', marginBottom: '20px' }}
                />
            </div>

            <ExportTableToExcel data={data} typeTable="ordersTable" />
            <TableComponent
                handleDeleteMany={handleDeleteMany}
                columns={columns}
                data={data}
                isPending={isPending}
                expandable={{
                    expandedRowRender: (record) => (
                        <Table
                            columns={expandColumns}
                            dataSource={record.expandedData}
                            pagination={false} // Tắt phân trang cho bảng mở rộng
                            style={{ paddingLeft: '40px' }}
                        />
                    ),
                    rowExpandable: (record) => record.name !== 'Not Expandable', // Điều kiện mở rộng (nếu cần)
                }}
            />
        </div>
    );
}

export default AdminOrders;
