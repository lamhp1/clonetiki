import { Col, Image, Row } from 'antd';
import styles from './ProfilePage.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import InputComponent from '~/components/Input/InputComponent';
import Button from '~/components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { useMutationHook } from '~/hooks/useMutationHook';
import { detailUser, updateAvatar, updateInfoUser } from '~/services/UserService';
import Loading from '~/components/loadingComponent/Loading';
import * as Message from '~/components/Message/Message';
import { updateUser } from '~/redux/slides/userSlice';

const cx = classNames.bind(styles);

function ProfilePage() {
    const dispatch = useDispatch();
    const user = useSelector((state) => {
        return state.user;
    });

    const { accessToken: access_token } = user;

    // console.log('user', user);

    const [isEditable, setIsEditable] = useState(false);
    const [buttonId, setButtonId] = useState(null);
    const [name, setName] = useState(user?.name);
    const [email, setEmail] = useState(user?.email);
    const [phone, setPhone] = useState(user?.phone);
    const [address, setAddress] = useState(user?.address);
    const [avatar, setAvatar] = useState(user?.avatar);

    const mutationUser = useMutationHook((data) => updateInfoUser(user?.id, data, access_token));
    const mutationAvatar = useMutationHook((formData) => updateAvatar(user?.id, formData, access_token));

    const { isPending, isSuccess, isError } = mutationUser;
    const { isPending: isPendingAvatar, isSuccess: isSuccessAvatar, isError: isErrorAvatar } = mutationAvatar;

    // console.log('accessToken profile', mutationData?.data);
    // console.log(isSuccess);

    useEffect(() => {
        if (isSuccess || isSuccessAvatar) {
            Message.successMessage();
            handleGetDetailUser();
            // console.log('dispath');
        } else if (isError || isErrorAvatar) {
            Message.errorMessage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isSuccessAvatar]);

    useEffect(() => {
        setName(user?.name);
        setEmail(user?.email);
        setPhone(user?.phone);
        setAddress(user?.address);
        setAvatar(user?.avatar);
    }, [user]);

    const handleGetDetailUser = async () => {
        let accessToken = localStorage.getItem('access_token');
        accessToken = JSON.parse(accessToken);
        const res = await detailUser(user?.id, accessToken);
        dispatch(updateUser({ ...res?.data, accessToken: accessToken }));
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const formData = new FormData();
            formData.append('avatar', file);
            mutationAvatar.mutate(formData);
        }
    };

    const handleInputName = (e) => {
        setName(e.target.value);
    };

    const handleInputEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleInputPhone = (e) => {
        setPhone(e.target.value);
    };

    const handleInputAddress = (e) => {
        setAddress(e.target.value);
    };
    const handleEdit = (e) => {
        setButtonId(e.target.id);
        if (isEditable) {
            // console.log('mutationing');
            mutationUser.mutate({
                name,
                email,
                phone,
                address,
                avatar,
            });
        }
        setIsEditable(!isEditable);
    };

    return (
        <>
            <h2 className={cx('title')}>THÔNG TIN TÀI KHOẢN</h2>
            <div className={cx('wrapper')}>
                <Loading isPending={isPending || isPendingAvatar}>
                    <Row style={{ height: '100%' }}>
                        <Col xs={24} md={8}>
                            <div className={cx('avatar')}>
                                <Image width={250} height={250} src={avatar} className={cx('img')} />
                                <label htmlFor="file-input" className={cx('upload-avatar')}>
                                    Thay đổi avatar
                                </label>
                                <input
                                    id="file-input"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={handleAvatarChange}
                                />
                            </div>
                        </Col>
                        <Col xs={24} md={16}>
                            <div className={cx('info')}>
                                <div className={cx('group')}>
                                    <label
                                        htmlFor="name"
                                        className={cx('label', { editing: buttonId === '1' && isEditable })}
                                    >
                                        Tên user
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <InputComponent
                                            type="text"
                                            id="name"
                                            value={name}
                                            className={cx('input')}
                                            disabled={!isEditable}
                                            onInputChange={handleInputName}
                                        />
                                        <Button primary className={cx('change-button')} onClick={handleEdit} id="1">
                                            <span id="1">{buttonId === '1' && isEditable ? 'Lưu' : 'Thay đổi'}</span>
                                        </Button>
                                    </div>
                                </div>
                                <div className={cx('group')}>
                                    <label htmlFor="email" className={cx('label')}>
                                        Email user
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <InputComponent
                                            type="text"
                                            id="email"
                                            value={email}
                                            className={cx('input')}
                                            disabled={!isEditable}
                                            onInputChange={handleInputEmail}
                                        />
                                        {/* <Button primary className={cx('change-button')} onClick={handleEdit} id="2">
                                        <span id="2">{buttonId === '2' && isEditable ? 'Lưu' : 'Thay đổi'}</span>
                                    </Button> */}
                                    </div>
                                </div>
                                <div className={cx('group')}>
                                    <label
                                        htmlFor="phone"
                                        className={cx('label', { editing: buttonId === '3' && isEditable })}
                                    >
                                        Số điện thoại
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <InputComponent
                                            type="text"
                                            id="phone"
                                            value={phone}
                                            className={cx('input')}
                                            disabled={!isEditable}
                                            onInputChange={handleInputPhone}
                                        />
                                        <Button primary className={cx('change-button')} onClick={handleEdit} id="3">
                                            <span id="3">{buttonId === '3' && isEditable ? 'Lưu' : 'Thay đổi'}</span>
                                        </Button>
                                    </div>
                                </div>
                                <div className={cx('group')}>
                                    <label
                                        htmlFor="address"
                                        className={cx('label', { editing: buttonId === '4' && isEditable })}
                                    >
                                        Địa chỉ
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <InputComponent
                                            type="text"
                                            id="address"
                                            value={address}
                                            className={cx('input')}
                                            disabled={!isEditable}
                                            onInputChange={handleInputAddress}
                                        />
                                        <Button primary className={cx('change-button')} onClick={handleEdit} id="4">
                                            <span id="4">{buttonId === '4' && isEditable ? 'Lưu' : 'Thay đổi'}</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Loading>
            </div>
        </>
    );
}

export default ProfilePage;
