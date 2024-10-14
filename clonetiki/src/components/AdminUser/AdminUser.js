import TableComponent from '../TableComponent/TableComponent';
// import Button from '../ButtonComponent/ButtonComponent';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { Button as ButtonAntd, Form, Image, Input, Select, Space } from 'antd';
import classNames from 'classnames/bind';
import styles from './AdminUser.module.scss';
import { useMutationHook } from '~/hooks/useMutationHook';
import { useSelector } from 'react-redux';
import Loading from '../loadingComponent/Loading';
import * as Message from '~/components/Message/Message';
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import ModalComponent from '../ModalComponent/ModalComponent';
import Highlighter from 'react-highlight-words';
import { deleteManyUser, deleteUser, detailUser, getAllUser, updateInfoUser } from '~/services/UserService';
import ExportTableToExcel from '../ExportTableToExcel/ExportTableToExcel';

const cx = classNames.bind(styles);

function AdminUser() {
    const user = useSelector((state) => {
        return state.user;
    });

    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState(''); //Table row
    const [open, setOpen] = useState(false); // drawer
    const [isOpeningUpdate, setIsOpeningUpdate] = useState(false);

    const [stateDetailUser, setstateDetailUser] = useState({
        name: '',
        email: '',
        isAdmin: '',
        phone: '',
        address: '',
    });

    // console.log('stateDetailUser', stateDetailUser);

    const [formDetail] = Form.useForm();

    const [imageUser, setimageUser] = useState('');

    //search column name
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    //end

    const mutationUserUpdate = useMutationHook((data) => {
        // console.log(data);
        const { id, token, ...rest } = data;
        const res = updateInfoUser(id, rest, token);
        return res;
    });

    const mutationDeleteUser = useMutationHook((id) => deleteUser(id, user?.accessToken));

    const mutationDeleteMany = useMutationHook((ids) => deleteManyUser({ ids }, user?.accessToken));

    const { isError: isErrorUpdate, isSuccess: isSuccessUpdate, isPending: isPendingUpdate } = mutationUserUpdate;

    const { isError: isErrorDelete, isSuccess: isSuccessDelete, isPending: isPendingDelete } = mutationDeleteUser;

    const { isError: isErrorDeleteMany, isSuccess: isSuccessDeleteMany } = mutationDeleteMany;

    useEffect(() => {
        if (isSuccessUpdate) {
            Message.successMessage();
            handleEndUpdate();
        } else if (isErrorUpdate) {
            Message.errorMessage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessUpdate, isErrorUpdate]);

    useEffect(() => {
        if (isSuccessDelete) {
            Message.successMessage();
        } else if (isErrorDelete) {
            Message.errorMessage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isErrorDelete, isSuccessDelete]);

    useEffect(() => {
        if (isSuccessDeleteMany) {
            Message.successMessage();
        } else if (isErrorDeleteMany) {
            Message.errorMessage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isErrorDeleteMany, isSuccessDeleteMany]);

    const handleCancelDelete = () => {
        setIsModalDeleteOpen(false);
    };

    const handleOkDelete = () => {
        setIsModalDeleteOpen(false);
        handleDeleteProduct();
    };

    const showModalDelete = () => {
        setIsModalDeleteOpen(true);
    };

    const handleEndUpdate = () => {
        setOpen(false);
        setstateDetailUser({
            name: '',
            email: '',
            isAdmin: '',
            phone: '',
            address: '',
        });
        setimageUser('');
        formDetail.resetFields();
    };

    // detail product
    const handleChangeInputDetail = (e) => {
        setstateDetailUser((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    const handleChangeInputDetailSelect = (value) => {
        setstateDetailUser((prev) => ({
            ...prev,
            isAdmin: value,
        }));
    };

    const handleChangeImage = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setimageUser(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    // updata product mutation
    const onFinishUpdate = async () => {
        //mutation data
        mutationUserUpdate.mutate(
            { id: rowSelected, token: user?.accessToken, ...stateDetailUser },
            {
                onSettled: () => {
                    refetch();
                },
            },
        );
    };

    //get All products
    const fetchAllUser = async () => {
        const res = await getAllUser();
        return res;
    };

    const {
        isPending,
        data: users,
        refetch,
    } = useQuery({
        queryKey: ['users'],
        queryFn: fetchAllUser,
        retry: 3,
        retryDelay: 1000,
    });

    //get detail Product
    const fetchDetailUser = async (id) => {
        const res = await detailUser(id, user?.accessToken);
        // console.log('res', res.data);
        if (res?.data) {
            setstateDetailUser({
                name: res?.data.name,
                email: res?.data.email,
                isAdmin: res?.data.isAdmin,
                phone: res?.data.phone,
                address: res?.data.address,
            });
            setimageUser(res?.data.avatar);
        }
        return res.data;
    };

    useEffect(() => {
        if (rowSelected) {
            fetchDetailUser(rowSelected);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSelected, open]);

    useEffect(() => {
        formDetail.setFieldsValue(stateDetailUser);
        setIsOpeningUpdate(false);
    }, [stateDetailUser, formDetail]);

    //Product Table
    const actionIcon = () => {
        return (
            <div>
                <DeleteOutlined
                    style={{ fontSize: '2rem', cursor: 'pointer', color: 'red' }}
                    onClick={showModalDelete}
                />
                <EditOutlined
                    style={{ fontSize: '2rem', cursor: 'pointer', color: 'blue' }}
                    onClick={handleDetailProduct}
                />
            </div>
        );
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
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('address'),
        },
        {
            title: 'Admin',
            dataIndex: 'admin',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: actionIcon,
        },
    ];
    const data = users?.data.map((user) => {
        return { ...user, key: user?._id, admin: user?.isAdmin ? 'True' : 'False' };
    });

    const handleDeleteProduct = () => {
        // console.log(rowSelected);
        mutationDeleteUser.mutate(rowSelected, {
            onSettled: () => {
                refetch();
            },
        });
    };

    const handleDeleteMany = (ids) => {
        mutationDeleteMany.mutate(ids, {
            onSettled: () => {
                refetch();
            },
        });
    };

    const handleDetailProduct = () => {
        setIsOpeningUpdate(true);
        // console.log('rowSelected', rowSelected);
        setOpen(true); //drawer
    };
    //drawer
    const onClose = () => {
        setOpen(false);
    };

    // const { Option } = Select;

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('header')}>Quản lí sản phẩm</h2>
            {/* <Button className={cx('button')}>
                <FontAwesomeIcon icon={faPlus} className={cx('icon')} />
            </Button> */}
            <ExportTableToExcel data={data} typeTable="userTable" />
            <TableComponent
                handleDeleteMany={handleDeleteMany}
                columns={columns}
                data={data}
                isPending={isPending}
                onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            setRowSelected(record._id);
                        }, // click row
                    };
                }}
            />
            <DrawerComponent forceRender title="Thông tin chi tiết" onClose={onClose} isOpen={open} width={600}>
                <Loading isPending={isOpeningUpdate || isPendingUpdate}>
                    <Form
                        name="detail user"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        form={formDetail}
                        initialValues={stateDetailUser}
                        onFinish={onFinishUpdate}
                        autoComplete="off"
                    >
                        <Form.Item
                            labelAlign="left"
                            labelCol={{ span: 6 }}
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Name user!',
                                },
                            ]}
                        >
                            <Input value={stateDetailUser.name} onChange={handleChangeInputDetail} id="name" />
                        </Form.Item>

                        <Form.Item
                            labelAlign="left"
                            labelCol={{ span: 6 }}
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email user!',
                                },
                            ]}
                        >
                            <Input value={stateDetailUser.email} onChange={handleChangeInputDetail} id="email" />
                        </Form.Item>

                        <Form.Item
                            labelAlign="left"
                            labelCol={{ span: 6 }}
                            label="Admin"
                            name="admin"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input admin product!',
                                },
                            ]}
                        >
                            <Select
                                placeholder={stateDetailUser.isAdmin ? 'True' : 'False'}
                                // defaultValue={stateDetailUser.isAdmin ? 'true' : 'false'}
                                onChange={handleChangeInputDetailSelect}
                                id="isAdmin"
                                options={[
                                    {
                                        value: 'true',
                                        label: 'True',
                                    },
                                    {
                                        value: 'false',
                                        label: 'False',
                                    },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            labelAlign="left"
                            labelCol={{ span: 6 }}
                            label="Phone"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input phone user!',
                                },
                            ]}
                        >
                            <Input
                                value={stateDetailUser.phone}
                                onChange={handleChangeInputDetail}
                                id="phone"
                                type="number"
                            />
                        </Form.Item>

                        <Form.Item
                            labelAlign="left"
                            labelCol={{ span: 6 }}
                            label="Address"
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input address user!',
                                },
                            ]}
                        >
                            <Input value={stateDetailUser.address} onChange={handleChangeInputDetail} id="address" />
                        </Form.Item>

                        <Form.Item
                            labelAlign="left"
                            labelCol={{ span: 6 }}
                            label="Image"
                            name="image"
                            rules={[
                                {
                                    required: false,
                                    message: 'Please input Image product!',
                                },
                            ]}
                        >
                            <div>
                                <Input onChange={handleChangeImage} id="image" type="file" disabled={true} />
                                {imageUser ? (
                                    <Image width={150} height={150} src={imageUser} className={cx('img')} />
                                ) : (
                                    ''
                                )}
                            </div>
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 18,
                                span: 14,
                            }}
                        >
                            <ButtonAntd type="primary" htmlType="submit">
                                Cập nhật
                            </ButtonAntd>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>

            <ModalComponent
                title="Xóa user"
                open={isModalDeleteOpen}
                onCancel={handleCancelDelete}
                onOk={handleOkDelete}
            >
                <Loading isPending={isPendingDelete}>
                    <div>Bạn có muốn xóa user này không?</div>
                </Loading>
            </ModalComponent>
        </div>
    );
}

export default AdminUser;
