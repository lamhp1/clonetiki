import { Col, Image, Row } from 'antd';
import classNames from 'classnames/bind';
import styles from './SignInPage.module.scss';
import logo from 'src/assets/img/logo-sign-in.png';
import SignInputComponent from '~/components/SignInputComponent/SignInputComponent';
import Button from '~/components/ButtonComponent/ButtonComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faEye } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { loginUser, detailUser } from '~/services/UserService';
import { useMutationHook } from '~/hooks/useMutationHook';
import Loading from '~/components/loadingComponent/Loading';
import * as Message from '~/components/Message/Message';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { updateUser } from '~/redux/slides/userSlice';

const cx = classNames.bind(styles);

function SignInPage() {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const mutation = useMutationHook((user) => loginUser(user));

    const { data, isPending, isError, isSuccess } = mutation;

    useEffect(() => {
        if (isSuccess && data.status === 'OK') {
            Message.successMessage();
            if (location?.state) {
                navigate(location?.state);
            } else {
                navigate('/');
            }
            localStorage.setItem('access_token', JSON.stringify(data?.accessToken));
            if (data?.accessToken) {
                const decoded = jwtDecode(data?.accessToken);
                if (decoded?.id) {
                    handleGetDetailUser(decoded?.id, data?.accessToken);
                }
            }
        } else if (isError) {
            Message.errorMessage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError]);

    const handleGetDetailUser = async (id, token) => {
        const res = await detailUser(id, token);
        dispatch(updateUser({ ...res?.data, accessToken: token }));
    };

    const handleNavigateSignUp = () => {
        navigate('/sign-up');
    };

    const handleOnChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleOnChangePW = (e) => {
        setPassword(e.target.value);
    };

    const handleOnChangPhone = (e) => {
        setPhone(e.target.value);
    };

    const submitSignIn = (e) => {
        e.preventDefault();
        mutation.mutate({
            email,
            password,
        });
    };
    return (
        <div className={cx('overlay')}>
            <Row className={cx('wrapper')}>
                <Col span={16} className={cx('left')}>
                    <div className={cx('signin-phonenumber')}>
                        <h3>Xin chào</h3>
                        <p>Đăng nhập hoặc tạo tài khoản</p>
                        <form>
                            <SignInputComponent
                                placeholder="Số điện thoại"
                                onInputChange={handleOnChangPhone}
                                value={phone}
                            />
                            <Button
                                primary
                                className={cx('sign-in-btn')}
                                onClick={submitSignIn}
                                disabled={!email.length || !password.length || !!phone.length}
                            >
                                Tiếp tục
                            </Button>
                        </form>
                        <p className={cx('toggle')}>Đăng nhập bằng Email</p>
                    </div>
                    <div className={cx('signin-account')}>
                        <div className={cx('back-icon')}>
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </div>
                        <h3 style={{ marginTop: '20px' }}>Đăng nhập bằng Email</h3>
                        <p>Nhập email và mật khẩu tài khoản tiki</p>
                        <form>
                            <SignInputComponent
                                type="text"
                                placeholder="abc@email.com"
                                onInputChange={handleOnChangeEmail}
                                value={email}
                            />
                            <div style={{ position: 'relative' }}>
                                <span
                                    onClick={() => setIsShowPassword(!isShowPassword)}
                                    className={cx('eyeicon', {
                                        isShowPassword,
                                    })}
                                >
                                    <FontAwesomeIcon icon={faEye} />
                                </span>
                                <SignInputComponent
                                    type={isShowPassword ? 'text' : 'password'}
                                    placeholder="Mật khẩu"
                                    onInputChange={handleOnChangePW}
                                    value={password}
                                />
                            </div>
                            {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                            <Loading isPending={isPending}>
                                <Button
                                    primary
                                    className={cx('sign-in-btn')}
                                    onClick={submitSignIn}
                                    disabled={!email.length || !password.length || !!phone.length}
                                >
                                    Đăng nhập
                                </Button>
                            </Loading>
                        </form>
                        <span className={cx('toggle')}>Quên mật khẩu?</span>
                        <p>
                            Chưa có tài khoản?{' '}
                            <span onClick={handleNavigateSignUp} className={cx('toggle')}>
                                Tạo tài khoản
                            </span>
                        </p>
                    </div>
                </Col>
                <Col span={8} className={cx('right')}>
                    <Image src={logo} preview={false} width={200} />
                    <h3>Mua sắm tại Tiki</h3>
                    <p>Siêu ưu đãi mỗi ngày</p>
                </Col>
            </Row>
        </div>
    );
}

export default SignInPage;
