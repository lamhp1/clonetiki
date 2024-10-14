import { useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './OrderSuccessPage.module.scss';
import { Image } from 'antd';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeOrderSuccess } from '~/redux/slides/orderSlice';

const cx = classNames.bind(styles);

function OrderSuccessPage() {
    const location = useLocation();

    const dispatch = useDispatch();

    // console.log('location', location);

    const { deliveryInfo, deliveryMethod, totalPrice, orderItemsSelected } = location?.state;

    useEffect(() => {
        let checkListId = [];
        orderItemsSelected?.forEach((item) => {
            checkListId.push(item?.product);
        });
        // console.log('checkList', checkListId);
        dispatch(removeOrderSuccess({ checkListId }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={cx('wrapper')}>
            <h4>Thông tin đơn hàng</h4>
            <div className={cx('wrapper-info')}>
                <div className={cx('delivery-info')}>
                    <div className={cx('delivery-item')}>
                        <h4>Phương thức vận chuyển</h4>
                        <div className={cx('option')}>
                            <p style={{ margin: '0', fontSize: '1.4rem' }}>
                                <span className={cx('ship-info')}>{deliveryMethod}</span> giao hàng tiết kiệm
                            </p>
                        </div>
                    </div>
                    <div className={cx('delivery-item')}>
                        <h4>Phương thức thanh toán</h4>
                        <div className={cx('option')} style={{ fontSize: '1.4rem' }}>
                            Thanh toán sau khi nhận hàng
                        </div>
                    </div>
                </div>
                <div className={cx('info')}>
                    <h4>Thông tin giao hàng</h4>
                    <div style={{ marginTop: '10px' }}>
                        <p className={cx('item')}>
                            Người nhận: <strong>{deliveryInfo?.fullName}</strong>
                        </p>
                        <p className={cx('item')}>
                            Địa chỉ: <strong>{deliveryInfo?.address}</strong>
                        </p>
                        <p className={cx('item')}>
                            SĐT: <strong>{deliveryInfo?.phone}</strong>
                        </p>
                    </div>
                </div>
            </div>
            <h2 className={cx('total-price')}>
                Tổng tiền thanh toán: <span>{totalPrice.toLocaleString()} đ</span>
            </h2>
            {orderItemsSelected?.map((orderItem) => (
                <div className={cx('wrapper-products')} key={orderItem?.product}>
                    <Image
                        src={orderItem?.image}
                        alt="anh sp"
                        width={70}
                        height={70}
                        style={{ objectFit: 'cover', flex: 1 }}
                    />
                    <p style={{ flex: 3, marginLeft: '15px' }}>
                        Tên sản phẩm: <strong>{orderItem?.name}</strong>
                    </p>
                    <p style={{ flex: 1 }}>
                        Số lượng: <strong>{orderItem?.amount}</strong>
                    </p>
                    <p style={{ flex: 1 }}>
                        Đơn giá: <strong>{orderItem?.price?.toLocaleString()} đ</strong>
                    </p>
                    <p style={{ flex: 1 }}>
                        Giảm giá: <strong>{orderItem?.disCount} %</strong>
                    </p>
                </div>
            ))}
        </div>
    );
}

export default OrderSuccessPage;
