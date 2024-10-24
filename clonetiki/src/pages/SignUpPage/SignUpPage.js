import { Col, Image, Row } from 'antd';
import classNames from 'classnames/bind';
import styles from './SignUpPage.module.scss';
import logo from 'src/assets/img/logo-sign-in.png';
import SignInputComponent from '~/components/SignInputComponent/SignInputComponent';
import Button from '~/components/ButtonComponent/ButtonComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faEye } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useMutationHook } from '~/hooks/useMutationHook';
import { signupUser } from '~/services/UserService';
import Loading from '~/components/loadingComponent/Loading';
import * as Message from '~/components/Message/Message';

const cx = classNames.bind(styles);

function SignUpPage() {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();

    const mutation = useMutationHook((user) => signupUser(user));

    const { data, isPending, isError, isSuccess } = mutation;

    useEffect(() => {
        if (isSuccess && data.status === 'OK') {
            Message.successMessage();
            handleNavigateSignIn();
        } else if (isError) {
            Message.errorMessage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isError, isSuccess]);

    // console.log(mutation);

    const handleNavigateSignIn = () => {
        navigate('/sign-in');
    };

    const handleOnChangeName = (e) => {
        setName(e.target.value);
    };
    const handleOnChangeEmail = (e) => {
        setEmail(e.target.value);
    };
    const handleOnChangePW = (e) => {
        setPassword(e.target.value);
    };
    const handleOnChangeConfirmPW = (e) => {
        setPasswordConfirm(e.target.value);
    };
    const handleOnChangePhone = (e) => {
        setPhone(e.target.value);
    };

    const submitSignUP = (e) => {
        e.preventDefault();
        mutation.mutate({
            name,
            email,
            password,
            passwordConfirm,
            phone,
        });
    };

    const handleToHome = () => {
        navigate('/')
    }

    return (
        <div className={cx('overlay')}>
            <Row className={cx('wrapper')}>
                <Col xs={24} md={16} className={cx('left')}>
                    <div className={cx('signin-account')}>
                        <div className={cx('back-icon')} onClick={handleToHome}>
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </div>
                        <h3 style={{ marginTop: '20px' }}>Đăng kí tài khoản</h3>
                        <form>
                            <SignInputComponent
                                type="text"
                                placeholder="Nhập họ và tên"
                                onInputChange={handleOnChangeName}
                                value={name}
                            />
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
                            <div style={{ position: 'relative' }}>
                                <span
                                    onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                                    className={cx('eyeicon', {
                                        isShowConfirmPassword,
                                    })}
                                >
                                    <FontAwesomeIcon icon={faEye} />
                                </span>
                                <SignInputComponent
                                    type={isShowConfirmPassword ? 'text' : 'password'}
                                    placeholder="Nhập lại mật khẩu"
                                    onInputChange={handleOnChangeConfirmPW}
                                    value={passwordConfirm}
                                />
                            </div>
                            <SignInputComponent
                                type="text"
                                placeholder="Số điện thoại"
                                onInputChange={handleOnChangePhone}
                                value={phone}
                            />
                            {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                            <Loading isPending={isPending}>
                                <Button
                                    primary
                                    className={cx('sign-in-btn')}
                                    onClick={submitSignUP}
                                    disabled={
                                        !name.length ||
                                        !email.length ||
                                        !password.length ||
                                        !passwordConfirm.length ||
                                        !phone.length
                                    }
                                >
                                    Đăng kí
                                </Button>
                            </Loading>
                        </form>
                        <p>
                            Bạn đã có tài khoản{' '}
                            <span onClick={handleNavigateSignIn} className={cx('toggle')}>
                                Đăng nhập
                            </span>
                        </p>
                    </div>
                </Col>
                <Col xs={24} md={8} className={cx('right')}>
                    <Image src={logo} preview={false} width={200} />
                    <h3>Mua sắm tại Tiki</h3>
                    <p>Siêu ưu đãi mỗi ngày</p>
                </Col>
            </Row>
        </div>
    );
}

export default SignUpPage;
