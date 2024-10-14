import TableComponent from '../TableComponent/TableComponent';
import Button from '../ButtonComponent/ButtonComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { Button as ButtonAntd, Form, Image, Input, Select, Space } from 'antd';
import classNames from 'classnames/bind';
import styles from './AdminProduct.module.scss';
import { useMutationHook } from '~/hooks/useMutationHook';
import {
    createImageProduct,
    createProduct,
    deleteManyProduct,
    deleteProduct,
    getAllProduct,
    getAllTypeProduct,
    getDetailProduct,
    updateProduct,
} from '~/services/ProductService';
import { useSelector } from 'react-redux';
import Loading from '../loadingComponent/Loading';
import * as Message from '~/components/Message/Message';
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import ModalComponent from '../ModalComponent/ModalComponent';
import Highlighter from 'react-highlight-words';
import ExportTableToExcel from '../ExportTableToExcel/ExportTableToExcel';
import { renderOptions } from '~/ultils';

const cx = classNames.bind(styles);

function AdminProduct() {
    const user = useSelector((state) => {
        return state.user;
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState(''); //Table row
    const [open, setOpen] = useState(false); // drawer
    const [isOpeningUpdate, setIsOpeningUpdate] = useState(false);
    const [stateProduct, setStateProduct] = useState({
        name: '',
        type: '',
        price: '',
        countInStock: '',
        description: '',
        addType: '',
        disCount: '',
    });

    const [stateDetailProduct, setStateDetailProduct] = useState({
        name: '',
        type: '',
        price: '',
        countInStock: '',
        description: '',
        disCount: '',
    });

    const [typeProduct, setTypeProduct] = useState([]);
    const [addType, setAddtype] = useState(false);

    // console.log('stateDetailProduct', stateDetailProduct);

    const [form] = Form.useForm();
    const [formDetail] = Form.useForm();

    const [imageProduct, setImageProduct] = useState('');
    const [formData, setFormData] = useState(new FormData());

    //search column name
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    //end

    const mutationProduct = useMutationHook((product) => createProduct(product, user?.accessToken));

    const mutationImageProduct = useMutationHook((formData) => createImageProduct(formData, user?.accessToken));

    const mutationProductUpdate = useMutationHook((data) => {
        const { id, token, ...rest } = data;
        const res = updateProduct(id, token, rest);
        return res;
    });

    const mutationDeleteProduct = useMutationHook((id) => deleteProduct(id, user?.accessToken));

    const mutationDeleteMany = useMutationHook((ids) => deleteManyProduct({ ids }, user?.accessToken));

    const { data: dataImageProduct, isSuccess: isSuccessImage, isPending: isPendingImage } = mutationImageProduct;

    const { isPending: isPendingCreate, isSuccess, isError } = mutationProduct;

    const { isError: isErrorUpdate, isSuccess: isSuccessUpdate, isPending: isPendingUpdate } = mutationProductUpdate;

    const { isError: isErrorDelete, isSuccess: isSuccessDelete, isPending: isPendingDelete } = mutationDeleteProduct;

    const { isError: isErrorDeleteMany, isSuccess: isSuccessDeleteMany } = mutationDeleteMany;

    useEffect(() => {
        if (isSuccess) {
            Message.successMessage();
            handleCancel();
        } else if (isError) {
            Message.errorMessage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError]);

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

    const showModal = () => {
        setIsModalOpen(true);
    };

    const showModalDelete = () => {
        setIsModalDeleteOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
            name: '',
            type: '',
            price: '',
            countInStock: '',
            description: '',
            disCount: '',
        });
        setImageProduct('');
        form.resetFields();
    };

    const handleCancelDelete = () => {
        setIsModalDeleteOpen(false);
    };

    const handleOkDelete = () => {
        setIsModalDeleteOpen(false);
        handleDeleteProduct();
    };

    const handleEndUpdate = () => {
        setOpen(false);
        setStateDetailProduct({
            name: '',
            type: '',
            price: '',
            countInStock: '',
            description: '',
            disCount: '',
        });
        setImageProduct('');
        formDetail.resetFields();
    };

    const handleChangeInput = (e) => {
        setStateProduct((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    //detail product
    const handleChangeInputDetail = (e) => {
        setStateDetailProduct((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    const handleChangeImage = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImageProduct(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);

            const newFormData = new FormData();
            newFormData.append('imageProduct', file);
            setFormData(newFormData);
        }
    };

    useEffect(() => {
        // console.log('data', {
        //     name: stateProduct.name,
        //     type: stateProduct.type !== 'add-type' ? stateProduct.type : stateProduct.addType,
        //     price: stateProduct.price,
        //     countInStock: stateProduct.countInStock,
        //     description: stateProduct.description,
        //     disCount: stateProduct.disCount,
        //     imageData: dataImageProduct,
        // });
        if (isSuccessImage && isModalOpen) {
            mutationProduct.mutate(
                {
                    name: stateProduct.name,
                    type: stateProduct.type !== 'add-type' ? stateProduct.type : stateProduct.addType,
                    price: stateProduct.price,
                    countInStock: stateProduct.countInStock,
                    description: stateProduct.description,
                    disCount: stateProduct.disCount,
                    imageData: dataImageProduct,
                },
                {
                    onSettled: () => {
                        refetch();
                    },
                },
            );
        }
        if (isSuccessImage && open) {
            mutationProductUpdate.mutate(
                { id: rowSelected, token: user?.accessToken, ...stateDetailProduct, imageData: dataImageProduct },
                {
                    onSettled: () => {
                        refetch();
                    },
                },
            );
        }
        setFormData(new FormData());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessImage]);

    const onFinish = () => {
        mutationImageProduct.mutate(formData);
    };

    //updata product mutation
    const onFinishUpdate = async () => {
        // Hàm kiểm tra `FormData` có rỗng hay không
        const isFormDataEmpty = (fd) => {
            for (let pair of fd.entries()) {
                return false; // Nếu tìm thấy ít nhất một mục, thì FormData không rỗng
            }
            return true; // Nếu không có mục nào, FormData rỗng
        };

        //mutation data
        if (isFormDataEmpty(formData)) {
            mutationProductUpdate.mutate(
                { id: rowSelected, token: user?.accessToken, ...stateDetailProduct },
                {
                    onSettled: () => {
                        refetch();
                    },
                },
            );
        }
        if (!isFormDataEmpty(formData)) {
            await mutationImageProduct.mutateAsync(formData);
            setFormData(new FormData());
        }
    };

    //get All products
    const fetchAllProduct = async () => {
        const res = await getAllProduct();
        return res;
    };

    const {
        isPending,
        data: products,
        refetch,
    } = useQuery({
        queryKey: ['products'],
        queryFn: fetchAllProduct,
        retry: 3,
        retryDelay: 1000,
    });

    //get detail Product
    const fetchDetailProduct = async (id) => {
        const res = await getDetailProduct(id);
        // console.log('res', res.data);
        if (res?.data) {
            setStateDetailProduct({
                name: res?.data.name,
                type: res?.data.type,
                price: res?.data.price,
                countInStock: res?.data.countInStock,
                description: res?.data.description,
                disCount: res?.data.disCount,
            });
            setImageProduct(res?.data.image);
        }
        return res.data;
    };

    useEffect(() => {
        if (rowSelected) {
            fetchDetailProduct(rowSelected);
        }
    }, [rowSelected, open]);

    useEffect(() => {
        formDetail.setFieldsValue(stateDetailProduct);
        setIsOpeningUpdate(false);
    }, [stateDetailProduct, formDetail]);

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
            title: 'Type',
            dataIndex: 'type',
            filters: [
                { text: 'nam', value: 'nam' },
                { text: 'nu', value: 'nu' },
            ],
            onFilter: (value, record) => record.type.includes(value),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            filters: [
                { text: 'Dưới 500.000vnđ', value: '<500000' },
                { text: 'Hơn 500.000vnđ', value: '>=500000' },
            ],
            onFilter: (value, record) => {
                if (value === '<500000') {
                    return record.price < 500000;
                } else if (value === '>=500000') {
                    return record.price >= 500000;
                }
            },
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            sorter: (a, b) => a.price - b.price,
            filters: [
                { text: 'Dưới 3 sao', value: '<3' },
                { text: 'Hơn 3 sao', value: '>=3' },
            ],
            onFilter: (value, record) => {
                if (value === '<3') {
                    return record.rating < 3;
                } else if (value === '>=3') {
                    return record.rating >= 3;
                }
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: actionIcon,
        },
    ];
    const data = products?.data.map((product) => {
        return { ...product, key: product?._id };
    });

    const handleDeleteProduct = () => {
        // console.log(rowSelected);
        mutationDeleteProduct.mutate(rowSelected, {
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

    //handle type product
    const fetchAllTypeProduct = async () => {
        const res = await getAllTypeProduct();
        if (res?.status === 'OK') {
            setTypeProduct(res?.data);
        }
    };

    useEffect(() => {
        fetchAllTypeProduct();
    }, []);

    const handleChangeSelect = (e) => {
        if (e === 'add-type') {
            setAddtype(true);
        } else {
            setAddtype(false);
        }
        setStateProduct((prev) => {
            return { ...prev, type: e };
        });
    };

    // console.log('state product', stateProduct);

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('header')}>Quản lí sản phẩm</h2>
            <Button className={cx('button')} onClick={showModal}>
                <FontAwesomeIcon icon={faPlus} className={cx('icon')} />
            </Button>
            <ExportTableToExcel data={data} typeTable="productTable" />
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

            <ModalComponent title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Loading isPending={isPendingImage || isPendingCreate}>
                    <Form
                        name="create product"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        form={form}
                        onFinish={onFinish}
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
                                    message: 'Please input your Name product!',
                                },
                            ]}
                        >
                            <Input value={stateProduct.name} onChange={handleChangeInput} id="name" />
                        </Form.Item>

                        <Form.Item
                            labelAlign="left"
                            labelCol={{ span: 6 }}
                            label="Type"
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your type product!',
                                },
                            ]}
                        >
                            <Select
                                // defaultValue="lucy"
                                style={{
                                    width: '100%',
                                }}
                                onChange={(e) => handleChangeSelect(e)}
                                options={renderOptions(typeProduct)}
                            />
                        </Form.Item>

                        {addType && (
                            <Form.Item
                                labelAlign="left"
                                labelCol={{ span: 6 }}
                                label="Add Type"
                                name="addType"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your type product!',
                                    },
                                ]}
                            >
                                <Input value={stateProduct.addType} onChange={handleChangeInput} id="addType" />
                            </Form.Item>
                        )}

                        <Form.Item
                            labelAlign="left"
                            labelCol={{ span: 6 }}
                            label="CountInStock"
                            name="countInStock"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input CountInStock product!',
                                },
                            ]}
                        >
                            <Input
                                value={stateProduct.countInStock}
                                onChange={handleChangeInput}
                                id="countInStock"
                                type="number"
                                min="0"
                            />
                        </Form.Item>

                        <Form.Item
                            labelAlign="left"
                            labelCol={{ span: 6 }}
                            label="Price"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input Price product!',
                                },
                            ]}
                        >
                            <Input
                                value={stateProduct.price}
                                onChange={handleChangeInput}
                                id="price"
                                type="number"
                                step="1000"
                                min="0"
                                suffix="đ"
                            />
                        </Form.Item>

                        <Form.Item
                            labelAlign="left"
                            labelCol={{ span: 6 }}
                            label="Discount"
                            name="disCount"
                            initialValue={0}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input Discount product!',
                                },
                            ]}
                        >
                            <Input
                                value={stateProduct.disCount}
                                onChange={handleChangeInput}
                                id="disCount"
                                type="number"
                                step="1"
                                min="0"
                                max="100"
                                suffix="%"
                            />
                        </Form.Item>

                        <Form.Item
                            labelAlign="left"
                            labelCol={{ span: 6 }}
                            label="Description"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input Description product!',
                                },
                            ]}
                        >
                            <Input value={stateProduct.description} onChange={handleChangeInput} id="description" />
                        </Form.Item>

                        <Form.Item
                            labelAlign="left"
                            labelCol={{ span: 6 }}
                            label="Image"
                            name="image"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input Image product!',
                                },
                            ]}
                        >
                            <div>
                                <Input onChange={handleChangeImage} id="image" type="file" />
                                {imageProduct ? (
                                    <Image width={150} height={150} src={imageProduct} className={cx('img')} />
                                ) : (
                                    ''
                                )}
                            </div>
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 20,
                                span: 14,
                            }}
                        >
                            <ButtonAntd type="primary" htmlType="submit">
                                Submit
                            </ButtonAntd>
                        </Form.Item>
                    </Form>
                </Loading>
            </ModalComponent>
            <DrawerComponent forceRender title="Thông tin chi tiết" onClose={onClose} isOpen={open} width={600}>
                <Loading isPending={isOpeningUpdate || isPendingUpdate || isPendingImage}>
                    <Form
                        name="detail product"
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
                        initialValues={stateDetailProduct}
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
                                    message: 'Please input your Name product!',
                                },
                            ]}
                        >
                            <Input value={stateDetailProduct.name} onChange={handleChangeInputDetail} id="name" />
                        </Form.Item>

                        <Form.Item
                            labelAlign="left"
                            labelCol={{ span: 6 }}
                            label="Type"
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your type product!',
                                },
                            ]}
                        >
                            <Input value={stateDetailProduct.type} onChange={handleChangeInputDetail} id="type" />
                        </Form.Item>

                        <Form.Item
                            labelAlign="left"
                            labelCol={{ span: 6 }}
                            label="Count In Stock"
                            name="countInStock"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input CountInStock product!',
                                },
                            ]}
                        >
                            <Input
                                value={stateDetailProduct.countInStock}
                                onChange={handleChangeInputDetail}
                                id="countInStock"
                                type="number"
                                min="0"
                            />
                        </Form.Item>

                        <Form.Item
                            labelAlign="left"
                            labelCol={{ span: 6 }}
                            label="Price"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input Price product!',
                                },
                            ]}
                        >
                            <Input
                                value={stateDetailProduct.price}
                                onChange={handleChangeInputDetail}
                                id="price"
                                type="number"
                                step="1000"
                                min="0"
                                suffix="đ"
                            />
                        </Form.Item>

                        <Form.Item
                            labelAlign="left"
                            labelCol={{ span: 6 }}
                            label="Discount"
                            name="disCount"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input disCount! (min = 0, max = 100)',
                                },
                            ]}
                        >
                            <Input
                                value={stateDetailProduct.price}
                                onChange={handleChangeInputDetail}
                                id="disCount"
                                type="number"
                                step="1"
                                min="0"
                                max="100"
                                suffix="%"
                            />
                        </Form.Item>

                        <Form.Item
                            labelAlign="left"
                            labelCol={{ span: 6 }}
                            label="Description"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input Description product!',
                                },
                            ]}
                        >
                            <Input
                                value={stateDetailProduct.description}
                                onChange={handleChangeInputDetail}
                                id="description"
                            />
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
                                <Input onChange={handleChangeImage} id="image" type="file" />
                                {imageProduct ? (
                                    <Image width={150} height={150} src={imageProduct} className={cx('img')} />
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
                title="Xóa sản phẩm"
                open={isModalDeleteOpen}
                onCancel={handleCancelDelete}
                onOk={handleOkDelete}
            >
                <Loading isPending={isPendingDelete}>
                    <div>Bạn có muốn xóa sản phẩm này không?</div>
                </Loading>
            </ModalComponent>
        </div>
    );
}

export default AdminProduct;
