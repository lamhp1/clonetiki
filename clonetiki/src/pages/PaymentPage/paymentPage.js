import { Button, Col, Form, Input, Radio, Row } from 'antd';
import classNames from 'classnames/bind';
import styles from './PaymentPage.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import { useMutationHook } from '~/hooks/useMutationHook';
import { updateInfoUser } from '~/services/UserService';
import * as Message from '~/components/Message/Message';
import { updateUser } from '~/redux/slides/userSlice';
import { createOrder } from '~/services/OrderService';
import Loading from '~/components/loadingComponent/Loading';
import { useNavigate } from 'react-router-dom';
import PayPalComponent from '~/components/PaypalComponent/PaypalComponent';
import { useMediaQuery } from 'react-responsive';

const cx = classNames.bind(styles);

function PaymentPage() {
    const user = useSelector((state) => state.user);
    // console.log('user', user);
    const order = useSelector((state) => state.order);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stateDetailUser, setstateDetailUser] = useState({
        fullName: user?.name,
        phone: user?.phone,
        address: user?.address,
    });
    const [choseDelivery, setChoseDelivery] = useState('FAST');
    const [choseMethodPayment, setChoseMethodPayment] = useState('cash');

    const [dataFromChild, setDataFromChild] = useState(false);
    const [paidTime, setPaidTime] = useState('');

    const { orderItemsSelected } = order;

    // console.log('orderItemsSelected', orderItemsSelected);

    // console.log('orderItems', orderItems);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formDetail] = Form.useForm();

    const mutationUserUpdate = useMutationHook((data) => {
        // console.log(data);
        const { id, token, ...rest } = data;
        const res = updateInfoUser(id, rest, token);
        return res;
    });

    const mutationCreateOrder = useMutationHook((data) => createOrder(user?.id, data, user?.accessToken));

    const { isError, isSuccess } = mutationUserUpdate;

    const {
        isError: isErrorCreate,
        isSuccess: isSuccessCreate,
        isPending: isPendingCreate,
        data: dataOrder,
    } = mutationCreateOrder;

    useEffect(() => {
        if (isSuccess) {
            Message.successMessage('cập nhật thành công');
            handleOk();
        } else if (isError) {
            Message.errorMessage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError]);

    useEffect(() => {
        if (isSuccessCreate && dataOrder?.message === 'success') {
            Message.successMessage('Đặt hàng thành công');
            navigate('/order-success', {
                state: {
                    deliveryInfo: stateDetailUser,
                    deliveryMethod: choseDelivery,
                    paymentMethod: choseMethodPayment,
                    totalPrice: memoTotalPrice,
                    orderItemsSelected,
                },
            });
        } else if (isSuccessCreate && dataOrder?.message === 'ERR') {
            const listDataOutOfStock = dataOrder?.data.filter((item) => 'id' in item);
            // console.log('listDataOutOfStock', listDataOutOfStock);
            const outOfStock = orderItemsSelected.filter((item1) => {
                return listDataOutOfStock.some((item2) => item1.product === item2.id);
            });
            // console.log(outOfStock);
            const listName = [];
            outOfStock?.forEach((item) => listName.push(item?.name));
            Message.errorMessage(`${listName?.join(',')} đã hết hàng trong kho`);
            navigate('/order');
        } else if (isErrorCreate) {
            Message.errorMessage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessCreate, isErrorCreate]);

    useEffect(() => {
        setstateDetailUser({
            fullName: user?.name,
            phone: user?.phone,
            address: user?.address,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.name, user?.phone, user?.address]);

    useEffect(() => {
        if (dataFromChild) {
            handlePurchase();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataFromChild]);

    const handlePurchase = () => {
        // console.log('dataFromChild', dataFromChild);
        if (
            orderItemsSelected &&
            stateDetailUser &&
            choseMethodPayment &&
            choseDelivery &&
            memoShipping !== undefined &&
            memoTotalPrice &&
            user
        ) {
            mutationCreateOrder.mutate({
                orderItems: orderItemsSelected,
                shippingAddress: stateDetailUser,
                paymentMethod: choseMethodPayment,
                deliveryMethod: choseDelivery,
                shippingPrice: memoShipping,
                totalPrice: memoTotalPrice,
                isPaid: dataFromChild ? true : false,
                paidAt: paidTime,
                user: user?.id,
                email: user?.email,
            });
        }
    };

    //modal
    const handleOpenModal = () => {
        formDetail.setFieldsValue(stateDetailUser);
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setstateDetailUser({
            fullName: user?.name,
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

    const onChangeDelivery = (e) => {
        // console.log('radio checked', e.target.value);
        setChoseDelivery(e.target.value);
    };

    const onChangeMethodPayment = (e) => {
        setChoseMethodPayment(e.target.value);
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
            return 20000;
        } else if (memoPrice >= 200000 && memoPrice < 500000) {
            return 10000;
        } else if (memoPrice >= 500000 || memoPrice === 0) {
            return 0;
        }
    }, [memoPrice]);

    const memoTotalPrice = useMemo(() => {
        return memoPrice - memoSaleOff + memoShipping;
    }, [memoPrice, memoSaleOff, memoShipping]);

    const handleDataFromChild = (data, update_time) => {
        // console.log('update_time', update_time);
        setDataFromChild(data);
        setPaidTime(update_time);
    };

    const RenderPaymentBtn = ({isMobile}) => {
        switch (choseMethodPayment) {
            case 'cash':
                return (
                    <Button type="primary" onClick={handlePurchase} block={true} style={{height: isMobile ? '48px' : ''}}>
                        Đặt hàng
                    </Button>
                );
            case 'paypal':
                return <PayPalComponent value={memoTotalPrice} sendData={handleDataFromChild} />;
            default:
                return <div>ERR</div>;
        }
    };

    //responsive
    const isMiniTablet = useMediaQuery({ minWidth: 768, maxWidth: 820 });
    const isMobile = useMediaQuery({ maxWidth: 767 });

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
                    <div>
                        <Loading isPending={isPendingCreate}><RenderPaymentBtn isMobile/></Loading>
                    </div>
                </div>
                </>
    }

    return (
        <div className={cx('wrapper')}>
            <h4>Thanh toán</h4>
            <Row style={{ display: 'flex' }}>
                <Col lg={18} xs={24} className={cx('wrapper-left')}>
                    <div className={cx('wrapper-info')}>
                        <p>Chọn phương thức giao hàng</p>
                        <div>
                            <Radio.Group onChange={onChangeDelivery} value={choseDelivery} className={cx('option')}>
                                <Radio value="FAST" className={cx('ship-item')}>
                                    <span className={cx('ship-info')}>FAST</span> giao hàng tiết kiệm
                                </Radio>
                                <Radio value="GO_JEK" className={cx('ship-item')}>
                                    <span className={cx('ship-info')}>GO_JEK</span> giao hàng tiết kiệm
                                </Radio>
                            </Radio.Group>
                        </div>
                        <p>Chọn phương thức thanh toán</p>
                        <div>
                            <Radio.Group
                                onChange={onChangeMethodPayment}
                                value={choseMethodPayment}
                                className={cx('option')}
                            >
                                <Radio value={'cash'} className={cx('ship-item')}>Thanh toán tiền mặt khi nhận hàng</Radio>
                                <Radio value={'paypal'} className={cx('ship-item')}>Thanh toán bằng PayPal</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                </Col>
                <Col lg={6} xs={24} className={cx('wrapper-right')}>
                    {isMobile ? <ResponsiveMobileRight/> : (<>
                        <div className={cx('delivery-info')}>
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
                            <p>Tổng tiền</p>
                            <span className={cx('price')}>{memoTotalPrice.toLocaleString()} đ</span>
                        </div>
                        <p style={{ textAlign: 'center', margin: '0' }}>(đã bao gồm VAT nếu có)</p>
                    </div>
                    <div style={{ height: '40px', flex: isMobile || isMiniTablet ? '1' : '' }}>
                        <Loading isPending={isPendingCreate}><RenderPaymentBtn/></Loading>
                    </div>
                    </>)}
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
                        name="fullName"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Name user!',
                            },
                        ]}
                    >
                        <Input value={stateDetailUser.fullName} onChange={handleChangeInputDetail} id="fullName" />
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

export default PaymentPage;
