import { useQuery } from '@tanstack/react-query';
import { Button, Image, Row } from 'antd';
import { useSelector } from 'react-redux';
import { deleteOrder, getDetailOrder } from '~/services/OrderService';
import styles from './MyOrderPage.module.scss';
import classNames from 'classnames/bind';
import { convertDate } from '~/ultils';
import Loading from '~/components/loadingComponent/Loading';
import React, { useEffect, useState } from 'react';
import { useMutationHook } from '~/hooks/useMutationHook';
import * as Message from '~/components/Message/Message';
import ModalComponent from '~/components/ModalComponent/ModalComponent';
import cartImg from '~/assets/img/carttachnen.png';

const cx = classNames.bind(styles);

function MyOrderPage() {
    const user = useSelector((state) => state.user);

    const { id: idUser, accessToken } = user;

    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [orderDelete, setOrderDelete] = useState({});

    const mutationDeleteOrder = useMutationHook((orderDelete) => deleteOrder(idUser, orderDelete, accessToken));

    const { isSuccess, isError, isPending: isPendingDelete } = mutationDeleteOrder;

    useEffect(() => {
        if (isSuccess) {
            Message.successMessage();
        } else if (isError) {
            Message.errorMessage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError]);

    const fetchGetOrder = async () => {
        const res = await getDetailOrder(idUser, accessToken);
        return res.data;
    };

    const {
        isPending,
        data: listOrders,
        refetch,
    } = useQuery({
        queryKey: ['orders'],
        queryFn: fetchGetOrder,
    });

    const handleDeleteOrder = (orderDelete) => {
        if (orderDelete) {
            mutationDeleteOrder.mutate(orderDelete, {
                onSuccess: () => {
                    refetch();
                },
            });
        }
    };

    const handleOpenModal = (order) => {
        setIsModalDeleteOpen(true);
        setOrderDelete(order);
    };

    const handleCancelDelete = () => {
        setIsModalDeleteOpen(false);
    };

    const handleOkDelete = () => {
        setIsModalDeleteOpen(false);
        handleDeleteOrder(orderDelete);
    };

    return (
        <>
            <Loading isPending={isPending}>
                <div className={cx('wrapper')}>
                    <h4>Đơn hàng của tôi</h4>
                    {listOrders && listOrders?.length !== 0 ? (
                        listOrders
                            ?.slice()
                            .reverse()
                            .map((order) => {
                                return (
                                    <Row className={cx('wrapper-item')} key={order?._id}>
                                        <div>
                                            <div className={cx('state-order')}>
                                                <p style={{ fontWeight: '500', fontSize: '1.5rem' }}>
                                                    Trạng thái:{' '}
                                                    <span style={{ float: 'right' }}>
                                                        Đặt hàng lúc: {convertDate(order?.createdAt)}
                                                    </span>
                                                </p>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-around',
                                                        borderBottom: '2px solid #efefef',
                                                    }}
                                                >
                                                    <p>
                                                        Giao hàng: <strong>Chưa giao hàng</strong> (đơn vị giao hàng:{' '}
                                                        <span className={cx('ship-info')}>{order?.deliveryMethod}</span>
                                                        )
                                                    </p>
                                                    <p>
                                                        Thanh toán:{' '}
                                                        <strong>
                                                            {order?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                                        </strong>
                                                    </p>
                                                </div>
                                            </div>
                                            {order?.orderItems.map((orderItem) => {
                                                return (
                                                    <div className={cx('product-order')} key={orderItem?._id}>
                                                        <Image
                                                            src={orderItem?.image}
                                                            alt="anh sp"
                                                            width={75}
                                                            height={75}
                                                            style={{ objectFit: 'cover', flex: '1' }}
                                                        ></Image>
                                                        <p style={{ paddingLeft: '10px', flex: '7' }}>
                                                            {orderItem?.name}
                                                        </p>
                                                        <p style={{ flex: '2' }}>
                                                            Số lượng: <strong>{orderItem?.amount}</strong>
                                                        </p>
                                                        <p style={{ flex: '2' }}>
                                                            Đơn giá:{' '}
                                                            <strong>{orderItem?.price.toLocaleString()} đ</strong>
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                            <div className={cx('footer-order')}>
                                                <p className={cx('text-price')}>
                                                    Tổng tiền (đã tính giảm giá và tiền vận chuyển):{' '}
                                                    <span style={{ color: 'red', fontSize: '1.8rem' }}>
                                                        {order?.totalPrice.toLocaleString()} đ
                                                    </span>
                                                </p>
                                                <div>
                                                    <Button
                                                        style={{ marginLeft: '15px' }}
                                                        onClick={() => handleOpenModal(order)}
                                                    >
                                                        Hủy đơn hàng
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Row>
                                );
                            })
                    ) : (
                        <Image src={cartImg} alt="cart" preview={false} width={900} style={{ marginLeft: '200px' }} />
                    )}
                    {}
                </div>
            </Loading>
            <ModalComponent
                title="Hủy đơn hàng"
                open={isModalDeleteOpen}
                onCancel={handleCancelDelete}
                onOk={handleOkDelete}
            >
                <Loading isPending={isPendingDelete}>
                    <div>Bạn có muốn hủy đơn hàng này không?</div>
                </Loading>
            </ModalComponent>
        </>
    );
}

export default MyOrderPage;
