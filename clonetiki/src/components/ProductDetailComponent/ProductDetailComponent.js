import { Button as ButtonAntd, Col, Form, Image, Input, Rate, Row } from 'antd';
import classNames from 'classnames/bind';
import styles from './ProductDetailComponent.module.scss';
import Button from '../ButtonComponent/ButtonComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getDetailProduct, rateProduct } from '~/services/ProductService';
import { useQuery } from '@tanstack/react-query';
import Loading from '../loadingComponent/Loading';
import { useLocation, useNavigate } from 'react-router-dom';
import { addOrder } from '~/redux/slides/orderSlice';
import * as Message from '~/components/Message/Message';
import { FacebookPlugins } from '~/ultils';
import FbLikeBtn from '../FbLikeBtn/FbLikeBtn';
import FbComment from '../FbComment/FbComment';
import ModalComponent from '../ModalComponent/ModalComponent';
import { useMutationHook } from '~/hooks/useMutationHook';
import { updateInfoUser } from '~/services/UserService';
import { updateUser } from '~/redux/slides/userSlice';

const cx = classNames.bind(styles);

function ProductDetailComponent({ idProduct }) {
    const user = useSelector((state) => state?.user);

    const [count, setCount] = useState(1);
    const [buyLoading, setBuyLoading] = useState(false);
    const [openRate, setOpenRate] = useState(false);
    const [openChangeAddress, setOpenChangeAddress] = useState(false);
    const [rate, setRate] = useState(5);
    const [addressChange, setAddressChange] = useState({ address: user?.address });
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formDetail] = Form.useForm();

    const mutationRateUpdate = useMutationHook((data) => rateProduct(product?._id, data));
    const mutationAddressUpdate = useMutationHook((data) => updateInfoUser(user?.id, data, user?.accessToken));

    const { isError: isErrorUpdate, isSuccess: isSuccessUpdate, isPending: isPendingRate } = mutationRateUpdate;

    const {
        isError: isErrorUpdateAddress,
        isSuccess: isSuccessUpdateAddress,
        isPending: isPendingUpdateAddress,
    } = mutationAddressUpdate;

    useEffect(() => {
        if (isSuccessUpdate) {
            Message.successMessage('Đánh giá sản phẩm thành công');
        } else if (isErrorUpdate) {
            Message.errorMessage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessUpdate, isErrorUpdate]);

    useEffect(() => {
        if (isSuccessUpdateAddress) {
            Message.successMessage('Cập nhật địa chỉ thành công');
            dispatch(updateUser({ ...user, address: addressChange?.address }));
            setOpenChangeAddress(false);
        } else if (isErrorUpdateAddress) {
            Message.errorMessage();
            setOpenChangeAddress(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessUpdateAddress, isErrorUpdateAddress]);

    useEffect(() => {
        if (user) {
            setAddressChange({ address: user?.address });
        }
    }, [user]);

    const fetchDetailProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1];
        if (id) {
            const res = await getDetailProduct(id);
            return res.data;
        }
    };

    const {
        isPending,
        data: product,
        refetch,
    } = useQuery({
        queryKey: ['product', idProduct],
        queryFn: fetchDetailProduct,
        enabled: !!idProduct,
    });

    useEffect(() => {
        FacebookPlugins();
    }, []);

    useEffect(() => {
        FacebookPlugins();
    }, [openRate]);

    // console.log('product', product);

    const handleOrderProduct = () => {
        setBuyLoading(true);
        if (!user?.id && buyLoading) {
            navigate('/sign-in', { state: location?.pathname });
        } else {
            setTimeout(() => {
                dispatch(
                    addOrder({
                        orderPayload: {
                            name: product?.name,
                            amount: count,
                            image: product?.image,
                            price: product?.price,
                            product: product?._id,
                            disCount: product?.disCount,
                            countInStock: product?.countInStock,
                            type: product?.type,
                        },
                    }),
                );
                setBuyLoading(false);
                Message.successMessage('Thêm vào giỏ hàng thành công');
            }, 500);
        }
    };

    const OpenRateModal = () => {
        setOpenRate(true);
    };

    const handleCancel = () => {
        setOpenRate(false);
    };

    const handleOk = () => {
        mutationRateUpdate.mutate(
            { rate },
            {
                onSuccess: () => {
                    refetch();
                },
            },
        );
        setOpenRate(false);
    };

    const handleRate = (e) => {
        if (e) {
            setRate(e);
        }
    };

    //Chang address

    const handleOpenChange = () => {
        setOpenChangeAddress(true);
    };

    const handleCancelAddress = () => {
        setOpenChangeAddress(false);
    };

    const onFinishUpdate = () => {
        mutationAddressUpdate.mutate(addressChange);
    };

    const handleChangeInputDetail = (e) => {
        setAddressChange({ address: e.target.value });
    };

    return (
        <Loading isPending={isPending}>
            <Row style={{ padding: '16px', background: '#fff' }}>
                <Col span={10} style={{ textAlign: 'center' }}>
                    <Image src={product?.image} alt="anh" className={cx('image-big')} />
                    <Row className={cx('image-small')}>
                        <Col>
                            <Image
                                src={product?.image}
                                alt="anh"
                                width={80}
                                height={80}
                                preview={false}
                                style={{ objectFit: 'cover' }}
                            />
                        </Col>
                        <Col>
                            <Image
                                src={product?.image}
                                alt="anh"
                                width={80}
                                height={80}
                                preview={false}
                                style={{ objectFit: 'cover' }}
                            />
                        </Col>
                        <Col>
                            <Image
                                src={product?.image}
                                alt="anh"
                                width={80}
                                height={80}
                                preview={false}
                                style={{ objectFit: 'cover' }}
                            />
                        </Col>
                        <Col>
                            <Image
                                src={product?.image}
                                alt="anh"
                                width={80}
                                height={80}
                                preview={false}
                                style={{ objectFit: 'cover' }}
                            />
                        </Col>
                        <Col>
                            <Image
                                src={product?.image}
                                alt="anh"
                                width={80}
                                height={80}
                                preview={false}
                                style={{ objectFit: 'cover' }}
                            />
                        </Col>
                        <Col>
                            <Image
                                src={product?.image}
                                alt="anh"
                                width={80}
                                height={80}
                                preview={false}
                                style={{ objectFit: 'cover' }}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <h1 className={cx('title')}>{product?.name}</h1>
                    <FbLikeBtn
                        dataHref={
                            process.env.REACT_APP_IS_LOCAL === 'true'
                                ? 'https://developers.facebook.com/docs/plugins/'
                                : window.location.href
                        }
                    />
                    <div className={cx('quality')}>
                        <Rate
                            disabled
                            allowHalf
                            defaultValue={product?.rating}
                            value={product?.rating}
                            className={cx('star')}
                        />
                        <span>
                            (Có {product?.rateCount} lượt đánh giá) -
                            <span
                                style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                                onClick={OpenRateModal}
                            >
                                {' '}
                                Đánh giá
                            </span>
                        </span>
                        <span> | Đã bán: {product?.selled}</span>
                        <span> | Còn lại: {product?.countInStock}</span>
                    </div>
                    <p className={cx('cost')}>
                        <span className={cx('price')}>{product?.price.toLocaleString()} đ</span>
                        {product?.disCount === 0 ? '' : <span className={cx('discount')}>-{product?.disCount}%</span>}
                    </p>
                    <div className={cx('delivery-info')}>
                        <h3>Thông tin vận chuyển</h3>
                        <div className={cx('address')}>
                            <p>Giao đến - {user?.address}</p>
                            <span onClick={handleOpenChange}>Đổi</span>
                        </div>
                    </div>
                    <div className={cx('quantity', 'input-group')}>
                        <p>Số lượng</p>
                        <div>
                            <Button
                                outline
                                className={cx('quantity-btn')}
                                onClick={() => setCount((prev) => prev - 1)}
                                disabled={count <= 0}
                            >
                                <FontAwesomeIcon icon={faMinus} />
                            </Button>
                            <input type="text" value={count} className={cx('nunmber')} readOnly />
                            <Button
                                outline
                                className={cx('quantity-btn')}
                                onClick={() => setCount((prev) => prev + 1)}
                                disabled={count >= product?.countInStock}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </Button>
                        </div>

                        <div className={cx('buy')}>
                            <Loading isPending={buyLoading}>
                                <Button
                                    primary
                                    className={cx('buy-btn')}
                                    onClick={handleOrderProduct}
                                    disabled={buyLoading || product?.countInStock === 0}
                                >
                                    {product?.countInStock === 0
                                        ? 'Hết hàng'
                                        : buyLoading
                                        ? 'Thêm vào giỏ hàng'
                                        : 'Chọn mua'}
                                </Button>
                            </Loading>
                            <Button
                                outline
                                className={cx('buy-btn')}
                                onClick={() => alert('Chức năng sẽ được cập nhật sau')}
                            >
                                Mua trước trả sau <br />
                                <span className={cx('lai-suat')}>Lãi suất 0%</span>
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
            <FbComment
                dataHref={
                    process.env.REACT_APP_IS_LOCAL === 'true'
                        ? 'https://developers.facebook.com/docs/plugins/'
                        : window.location.href
                }
            />
            <Loading isPending={isPendingRate}>
                <ModalComponent title="Đánh giá sản phẩm" isOpen={openRate} onOk={handleOk} onCancel={handleCancel}>
                    <Rate
                        allowHalf
                        defaultValue={product?.rating}
                        className={cx('star')}
                        style={{ fontSize: '4rem', marginLeft: '100px' }}
                        onChange={(e) => handleRate(e)}
                    />
                    <FbComment
                        dataHref={
                            process.env.REACT_APP_IS_LOCAL === 'true'
                                ? 'https://developers.facebook.com/docs/plugins/'
                                : window.location.href
                        }
                    />
                </ModalComponent>
            </Loading>
            <Loading isPending={isPendingUpdateAddress}>
                <ModalComponent
                    title="Thay đổi địa chỉ"
                    isOpen={openChangeAddress}
                    onCancel={handleCancelAddress}
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
                        initialValues={addressChange}
                        onFinish={onFinishUpdate}
                        autoComplete="off"
                    >
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
                            <Input value={addressChange.address} onChange={handleChangeInputDetail} id="address" />
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
                </ModalComponent>
            </Loading>
        </Loading>
    );
}

export default ProductDetailComponent;
