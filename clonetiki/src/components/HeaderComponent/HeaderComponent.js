import classNames from 'classnames/bind';
import styles from './HeaderComponent.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Image, Space } from 'antd';
import { logoutUser } from '~/services/UserService';
import { resetUser } from '~/redux/slides/userSlice';
import Loading from '../loadingComponent/Loading';
import { useEffect, useState } from 'react';
import { searchProduct } from '~/redux/slides/productSlice';
import LamShop from '~/assets/img/LamShop.png';
import { useMediaQuery } from 'react-responsive';

const cx = classNames.bind(styles);

function HeaderComponent({ isHiddenSearch = false, isHiddenCart = false }) {
    const user = useSelector((state) => {
        return state.user;
    });
    const order = useSelector((state) => state.order);

    const [loading, setLoading] = useState(false);
    const [isLogIn, setIsLogIn] = useState(false);
    const [name, setName] = useState(user?.name);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleNavigateLogin = () => {
        navigate('/sign-in');
    };

    const handleGoToHome = () => {
        navigate('/');
    };

    useEffect(() => {
        setName(user?.name);
    }, [user?.name]);

    useEffect(() => {
        if (user?.accessToken) {
            setIsLogIn(true);
        }
    }, [user]);

    const handleLogout = async () => {
        setLoading(true);
        await logoutUser();
        dispatch(resetUser());
        localStorage.removeItem('access_token');
        setIsLogIn(false);
        setLoading(false);
        navigate('/');
    };

    const handleGoToProfilePage = () => {
        navigate('/profile');
    };

    const handleGoToMyOrder = () => {
        navigate('/my-order');
    };

    const handleSystem = () => {
        navigate('/system/admin');
    };

    const items = [
        {
            key: '1',
            label: (
                <span onClick={handleGoToProfilePage} rel="noopener noreferrer">
                    Thông tin tài khoản
                </span>
            ),
        },
        user?.isAdmin && {
            key: '2',
            label: (
                <span onClick={handleSystem} rel="noopener noreferrer">
                    Quản lí hệ thống
                </span>
            ),
        },
        {
            key: '3',
            label: (
                <span onClick={handleGoToMyOrder} rel="noopener noreferrer">
                    Đơn hàng của tôi
                </span>
            ),
        },
        {
            key: '4',
            label: (
                <span onClick={handleLogout} rel="noopener noreferrer">
                    Đăng xuất
                </span>
            ),
        },
    ];

    const onSearch = (e) => {
        setSearch(e.target.value);
        dispatch(searchProduct(e.target.value));
    };

    //responsive
    const isMobile = useMediaQuery({ maxWidth: 767 });

    return (
        <div className={cx('wrapper')}>
            <div className={cx('row')} style={{display: 'flex', alignItems: 'center'}}>
                <div className={cx({ 'col-3': !isMobile })} onClick={handleGoToHome} style={{ cursor: 'pointer' }}>
                    <Image src={LamShop} alt="logo" width={isMobile ? 100 : 150} preview={false} />
                </div>
                <div className={cx({ 'col-6': !isMobile })}>
                    {!isHiddenSearch && <ButtonInputSearch value={search} onChange={onSearch} isMobile={isMobile} />}
                </div>
                {isMobile ? '' : (<div
                    className={cx({ 'col-3': !isMobile })}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                    <Loading isPending={loading}>
                        <Space direction="vertical">
                            <Dropdown menu={{ items }} placement="bottom" arrow disabled={!isLogIn}>
                                <div
                                    onClick={isLogIn ? null : handleNavigateLogin}
                                    className={cx('user-group')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {isLogIn ? (
                                        <Image
                                            width={40}
                                            height={40}
                                            src={user?.avatar}
                                            className={cx('img')}
                                            preview={false}
                                        />
                                    ) : (
                                        <FontAwesomeIcon icon={faUser} className={cx('user-icon')} />
                                    )}
                                    <div className={cx('user')}>
                                        {isLogIn ? <span>{name}</span> : <span>Đăng nhập/Đăng kí</span>}
                                        {isLogIn ? (
                                            <span>
                                                Tài khoản
                                                <FontAwesomeIcon icon={faCaretDown} style={{ marginLeft: '8px' }} />
                                            </span>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </div>
                            </Dropdown>
                        </Space>
                    </Loading>

                    {!isHiddenCart && (
                        <div
                            className={cx('position-relative')}
                            onClick={() => navigate('/order')}
                            style={{ cursor: 'pointer' }}
                        >
                            <FontAwesomeIcon icon={faCartShopping} className={cx('cart-icon', 'position-relative')} />
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                {isLogIn ? order?.orderItems.length : 0}
                                <span className="visually-hidden">unread messages</span>
                            </span>
                        </div>
                    )}
                </div>)}
            </div>
        </div>
    );
}

export default HeaderComponent;
