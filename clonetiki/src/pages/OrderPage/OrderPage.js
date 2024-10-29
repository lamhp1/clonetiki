import { Button, Col, Form, Image, Input, Popover, Row, Steps } from 'antd';
import classNames from 'classnames/bind';
import styles from './OrderPage.module.scss';
import { DeleteOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseAmount, increaseAmount, removeOrder, removeOderAll, orderSelected } from '~/redux/slides/orderSlice';
import { useEffect, useMemo, useState } from 'react';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import { useMutationHook } from '~/hooks/useMutationHook';
import { updateInfoUser } from '~/services/UserService';
import * as Message from '~/components/Message/Message';
import { updateUser } from '~/redux/slides/userSlice';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

const cx = classNames.bind(styles);

function OrderPage() {
    const user = useSelector((state) => state.user);

    // console.log('user', user);

    const order = useSelector((state) => state.order);
    const [checkListId, setCheckListId] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [stateDetailUser, setstateDetailUser] = useState({
        name: user?.name,
        phone: user?.phone,
        address: user?.address,
    });
    const navigate = useNavigate();
    const { orderItems, orderItemsSelected } = order;

    // console.log('orderItemsSelected', orderItemsSelected);

    const dispatch = useDispatch();

    const [formDetail] = Form.useForm();

    const mutationUserUpdate = useMutationHook((data) => {
        // console.log(data);
        const { id, token, ...rest } = data;
        const res = updateInfoUser(id, rest, token);
        return res;
    });

    const { isError, isSuccess } = mutationUserUpdate;

    useEffect(() => {
        if (isSuccess) {
            Message.successMessage();
            handleOk();
        } else if (isError) {
            Message.errorMessage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError]);

    useEffect(() => {
        setstateDetailUser({
            name: user?.name,
            phone: user?.phone,
            address: user?.address,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.name, user?.phone, user?.address]);

    const handleQuantity = (action, idProduct) => {
        switch (action) {
            case 'increase':
                dispatch(increaseAmount({ idProduct }));
                break;
            case 'decrease':
                dispatch(decreaseAmount({ idProduct }));
                break;
            default:
                return action;
        }
    };

    const handleDelOrder = (idProduct) => {
        if (idProduct) {
            dispatch(removeOrder({ idProduct }));
            const newCheckListId = checkListId.filter((item) => item !== idProduct);
            setCheckListId(newCheckListId);
        }
    };

    const handleCheck = (idProduct) => {
        if (checkListId?.includes(idProduct)) {
            const newCheckList = checkListId?.filter((item) => item !== idProduct);
            setCheckListId(newCheckList);
        } else {
            setCheckListId((prev) => {
                return [...prev, idProduct];
            });
        }
    };
    // console.log('stateDetailUser', stateDetailUser);

    const handleCheckAll = (e) => {
        let listItem = [];
        if (e.target.checked) {
            orderItems.forEach((item) => listItem.push(item?.product));
        } else {
            listItem = [];
        }
        setCheckListId(listItem);
    };

    const handleAddCart = () => {
        if (checkListId.length === 0) {
            Message.errorMessage('Vui lòng chọn sản phẩm');
        } else if (!user?.name || !user?.phone || !user?.address) {
            setIsModalOpen(true);
        } else {
            navigate('/payment');
        }
    };

    useEffect(() => {
        // console.log(checkListId);
        dispatch(orderSelected({ checkListId }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkListId]);

    const handleDelAll = () => {
        dispatch(removeOderAll());
    };

    //modal
    const handleOpenModal = () => {
        formDetail.setFieldsValue(stateDetailUser);
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setstateDetailUser({
            name: user?.name,
            phone: user?.phone,
            address: user?.address,
        });
    };

    const handleOk = () => {
        setIsModalOpen(false);
        dispatch(
            updateUser({
                ...user,
                _id: user?.id,
                name: stateDetailUser?.name,
                phone: stateDetailUser?.phone,
                address: stateDetailUser?.address,
            }),
        );
    };

    const onFinishUpdate = async () => {
        //mutation data
        if (stateDetailUser?.name && stateDetailUser?.phone && stateDetailUser?.address) {
            mutationUserUpdate.mutate({ id: user?.id, token: user?.accessToken, ...stateDetailUser });
        }
    };

    const handleChangeInputDetail = (e) => {
        setstateDetailUser((prev) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };
    //end modal

    //price calculator
    const memoPrice = useMemo(() => {
        const result = orderItemsSelected?.reduce((total, order) => {
            return total + order?.price * order?.amount;
        }, 0);
        if (orderItemsSelected?.length === 0) {
            return 0;
        } else {
            return result;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderItemsSelected]);

    const memoSaleOff = useMemo(() => {
        const result = orderItemsSelected?.reduce((total, order) => {
            return total + (order?.price * order?.amount * order?.disCount) / 100;
        }, 0);
        if (Number(result)) {
            return result;
        }
        return 0;
    }, [orderItemsSelected]);

    const memoShipping = useMemo(() => {
        if (memoPrice < 200000 && memoPrice !== 0) {
            setCurrentStep(0);
            return 20000;
        } else if (memoPrice >= 200000 && memoPrice < 500000) {
            setCurrentStep(1);
            return 10000;
        } else if (memoPrice >= 500000 || memoPrice === 0) {
            if (memoPrice >= 500000) {
                setCurrentStep(2);
            } else {
                setCurrentStep(0);
            }
            return 0;
        }
    }, [memoPrice]);

    const memoTotalPrice = useMemo(() => {
        return memoPrice - memoSaleOff + memoShipping;
    }, [memoPrice, memoSaleOff, memoShipping]);

    //responsive
    const isMiniTablet = useMediaQuery({ minWidth: 768, maxWidth: 820 });
    const isMobile = useMediaQuery({ maxWidth: 767 });

    const ResponsiveMobileLeft = () => {
        return <>
            <Row>
                    <Row style={{width: '100%'}} className={cx('info-order')}>
                        <Col span={18} style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                id="check"
                                name="check"
                                style={{ marginRight: '10px' }}
                                onChange={(e) => handleCheckAll(e)}
                                checked={checkListId?.length === orderItems?.length && checkListId?.length > 0}
                            />
                            <p style={{ fontWeight: '500' }}>Tất cả ({orderItems?.length} sản phẩm)</p>
                        </Col>
                        <Col span={6} style={{display: 'flex'}}>                                    
                                <p style={{ fontWeight: '500', marginRight: '10px' }}> Xóa tất cả</p>
                                <DeleteOutlined style={{ cursor: 'pointer' }} onClick={() => handleDelAll()} />                            
                        </Col>
                    </Row>
                    {orderItems &&
                        orderItems?.map((orderItem) => (
                            <Row className={cx('info-order')} key={orderItem?.product}>
                                <Col span={7} style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="checkbox"
                                        id="check"
                                        name="check"
                                        style={{ marginRight: '10px' }}
                                        onChange={() => handleCheck(orderItem?.product)}
                                        checked={checkListId?.includes(orderItem?.product)}
                                    />
                                    <Image
                                        src={orderItem?.image}
                                        width={65}
                                        height={65}
                                        style={{ objectFit: 'cover' }}
                                    />
                                    
                                </Col>
                                <Col span={16} style={{marginTop: '5px'}}>
                                    <p className={cx('name-order')}>
                                        {orderItem?.name}
                                    </p>
                                    <p style={{marginTop: '5px'}}> <strong>Đơn giá:</strong> {' '}
                                        {orderItem?.price.toLocaleString()}
                                        {' đ  '}
                                        {orderItem?.disCount === 0 ? (
                                            ''
                                        ) : (
                                            <span className={cx('discount')}>-{orderItem?.disCount}%</span>
                                        )}
                                    </p>                               
                                    <div className={cx('quantity')}>
                                        <strong>Số lượng: </strong>
                                        <div className={cx('quantity-block')}>
                                            <Button
                                                type="outline"
                                                className={cx('quantity-btn')}
                                                onClick={() => handleQuantity('decrease', orderItem?.product)}
                                                disabled={orderItem?.amount <= 1}
                                            >
                                                <FontAwesomeIcon icon={faMinus} />
                                            </Button>
                                            <input
                                                type="text"
                                                value={orderItem?.amount}
                                                className={cx('nunmber')}
                                                readOnly
                                            />
                                            <Button
                                                type="outline"
                                                className={cx('quantity-btn')}
                                                onClick={() => handleQuantity('increase', orderItem?.product)}
                                                disabled={orderItem?.amount >= orderItem?.countInStock}
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </Button>
                                        </div>
                                    </div>                             
                                    <span className={cx('price')} style={{ fontSize: '1.5rem' }}>
                                        <strong>Thành tiền: </strong>
                                        {Number(orderItem?.price * orderItem?.amount).toLocaleString()} {' đ  '}
                                        {orderItem?.disCount === 0 ? (
                                            ''
                                        ) : (
                                            <span className={cx('discount')}>-{orderItem?.disCount}%</span>
                                        )}
                                    </span>                             
                    
                                </Col>
                                <Col span={1}>
                                    <DeleteOutlined
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleDelOrder(orderItem?.product)}
                                    />
                                </Col>
                            </Row>
                        ))}
            </Row>
        </>
    }

    const ResponsiveMobileRight = () => {
        return <>
                <div className={cx('mobile-wrapper-right')}>
                    <div className={cx('delivery-info')}>
                                <h3>
                                    Thông tin giao hàng - <span onClick={handleOpenModal}>Thay đổi</span>
                                </h3>
                    </div>
                    <div className={cx('price-info')}>
                                <div className={cx('item')}>
                                    <p>Tạm tính</p>
                                    <strong>{memoPrice.toLocaleString()} đ</strong>
                                </div>
                                <div className={cx('item')}>
                                    <p>Giảm giá</p>
                                    <strong>-{memoSaleOff.toLocaleString()} đ</strong>
                                </div>
                                <div className={cx('item')}>
                                    <p>Thuế</p>
                                    <strong>0</strong>
                                </div>
                                <div className={cx('item')}>
                                    <p>Phí giao hàng</p>
                                    <strong>{memoShipping.toLocaleString()}</strong>
                                </div>
                                <div className={cx('item', 'item-price')}>
                                    <p>Tổng tiền: </p>
                                    <span className={cx('price')}>{memoTotalPrice.toLocaleString()} đ</span>
                                </div>
                                <p style={{ textAlign: 'center', margin: '0' }}>(đã bao gồm VAT nếu có)</p>
                    </div>
                    <Button type="primary" style={{ height: isMobile ? '48px' : '40px', flex: isMobile || isMiniTablet ? '1' : '' }} 
                        onClick={handleAddCart} className={cx('btn-buy')}>
                                Mua hàng
                    </Button>
                </div>
                </>
    }

    return (
        <div className={cx('wrapper')}>
            <h4>Giỏ hàng</h4>
            <Row style={{ display: 'flex' }}>
                <Col lg={18} xs={24} className={cx('wrapper-left')}>
                    {isMobile ? <ResponsiveMobileLeft /> : (<><Steps
                        style={{ backgroundColor: 'white', padding: '10px', borderRadius: '10px' }}
                        type="navigation"
                        current={currentStep}
                        initial={0}
                        items={[
                            {
                                title: '20.000 đ',
                                description: 'Tổng tiền < 200.000 đ',
                            },
                            {
                                title: '10.000 đ',
                                description: 'Tổng tiền < 500.000 đ',
                            },
                            {
                                title: '0 đ',
                                description: 'Tổng tiền > 500.000 đ',
                            },
                        ]}
                    />
                    <Row className={cx('info-order')}>
                        <Col span={10} style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                id="check"
                                name="check"
                                style={{ marginRight: '10px' }}
                                onChange={(e) => handleCheckAll(e)}
                                checked={checkListId?.length === orderItems?.length && checkListId?.length > 0}
                            />
                            <p style={{ fontWeight: '500' }}>Tất cả ({orderItems?.length} sản phẩm)</p>
                        </Col>
                        <Col span={4}>
                            <p style={{ fontWeight: '500' }}>Đơn giá</p>
                        </Col>
                        <Col span={5}>
                            <p style={{ fontWeight: '500', marginLeft: '35px' }}>Số lượng</p>
                        </Col>
                        <Col span={4}>
                            <p style={{ fontWeight: '500' }}>Thành tiền</p>
                        </Col>
                        <Col span={1}>
                            <Popover content="Xóa tất cả">
                                <DeleteOutlined style={{ cursor: 'pointer' }} onClick={() => handleDelAll()} />
                            </Popover>
                        </Col>
                    </Row>
                    {orderItems &&
                        orderItems?.map((orderItem) => (
                            <Row className={cx('info-order')} key={orderItem?.product}>
                                <Col span={10} style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="checkbox"
                                        id="check"
                                        name="check"
                                        style={{ marginRight: '10px' }}
                                        onChange={() => handleCheck(orderItem?.product)}
                                        checked={checkListId?.includes(orderItem?.product)}
                                    />
                                    <Image
                                        src={orderItem?.image}
                                        width={65}
                                        height={65}
                                        style={{ objectFit: 'cover' }}
                                    />
                                    <p style={{ marginLeft: '10px' }} className={cx('name-order')}>
                                        {orderItem?.name}
                                    </p>
                                </Col>
                                <Col span={4}>
                                    <p>
                                        {orderItem?.price.toLocaleString()}
                                        {' đ  '}
                                        {orderItem?.disCount === 0 ? (
                                            ''
                                        ) : (
                                            <span className={cx('discount')}>-{orderItem?.disCount}%</span>
                                        )}
                                    </p>
                                </Col>
                                <Col span={5}>
                                    <div className={cx('quantity')}>
                                        <Button
                                            type="outline"
                                            className={cx('quantity-btn')}
                                            onClick={() => handleQuantity('decrease', orderItem?.product)}
                                            disabled={orderItem?.amount <= 1}
                                        >
                                            <FontAwesomeIcon icon={faMinus} />
                                        </Button>
                                        <input
                                            type="text"
                                            value={orderItem?.amount}
                                            className={cx('nunmber')}
                                            readOnly
                                        />
                                        <Button
                                            type="outline"
                                            className={cx('quantity-btn')}
                                            onClick={() => handleQuantity('increase', orderItem?.product)}
                                            disabled={orderItem?.amount >= orderItem?.countInStock}
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                        </Button>
                                    </div>
                                </Col>
                                <Col span={4}>
                                    <span className={cx('price')} style={{ fontSize: '1.5rem' }}>
                                        {Number(orderItem?.price * orderItem?.amount).toLocaleString()} {' đ  '}
                                        {orderItem?.disCount === 0 ? (
                                            ''
                                        ) : (
                                            <span className={cx('discount')}>-{orderItem?.disCount}%</span>
                                        )}
                                    </span>
                                </Col>
                                <Col span={1}>
                                    <DeleteOutlined
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleDelOrder(orderItem?.product)}
                                    />
                                </Col>
                            </Row>
                        ))}</>)}
                </Col>
                <Col lg={6} xs={24} className={cx('wrapper-right')}>
                   {isMobile ? <ResponsiveMobileRight/> : (<> <div className={cx('delivery-info')}>
                        <h3>
                            Thông tin giao hàng - <span onClick={handleOpenModal}>Thay đổi</span>
                        </h3>
                        <p>
                            Tên: <strong>{user?.name}</strong>
                        </p>
                        <p>
                            SĐT: <strong>{user?.phone}</strong>
                        </p>
                        <p>
                            Địa chỉ: <strong>{user?.address}</strong>
                        </p>
                    </div>
                    <div className={cx('price-info')}>
                        <div className={cx('item')}>
                            <p>Tạm tính</p>
                            <strong>{memoPrice.toLocaleString()} đ</strong>
                        </div>
                        <div className={cx('item')}>
                            <p>Giảm giá</p>
                            <strong>-{memoSaleOff.toLocaleString()} đ</strong>
                        </div>
                        <div className={cx('item')}>
                            <p>Thuế</p>
                            <strong>0</strong>
                        </div>
                        <div className={cx('item')}>
                            <p>Phí giao hàng</p>
                            <strong>{memoShipping.toLocaleString()}</strong>
                        </div>
                        <div className={cx('item', 'item-price')}>
                            <p>Tổng tiền: </p>
                            <span className={cx('price')}>{memoTotalPrice.toLocaleString()} đ</span>
                        </div>
                        <p style={{ textAlign: 'center', margin: '0' }}>(đã bao gồm VAT nếu có)</p>
                    </div>
                    <Button type="primary" style={{ height: '40px', flex: isMobile || isMiniTablet ? '1' : '' }} onClick={handleAddCart}>
                        Mua hàng
                    </Button></>)}
                </Col>
            </Row>
            <ModalComponent
                title="Thông tin giao hàng"
                open={isModalOpen}
                onCancel={handleCancel}
                onOk={handleOk}
                footer={null}
            >
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
                            type="text"
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
                        wrapperCol={{
                            offset: 18,
                            span: 14,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </ModalComponent>
        </div>
    );
}

export default OrderPage;
