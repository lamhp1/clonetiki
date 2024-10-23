import classNames from 'classnames/bind';
import styles from './Navbar.module.scss';
import { Rate } from 'antd';
import { getAllTypeProduct } from '~/services/ProductService';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeVietnameseTones } from '~/ultils';

const cx = classNames.bind(styles);

function Navbar({ isMobile }) {
    const [typeProduct, setTypeProduct] = useState([]);
    const navigate = useNavigate();

    const fetchAllTypeProduct = async () => {
        const res = await getAllTypeProduct();
        if (res?.status === 'OK') {
            setTypeProduct(res?.data);
        }
    };

    useEffect(() => {
        fetchAllTypeProduct();
    }, []);

    const handleChangByType = async (option) => {
        if (option) {
            await navigate(`/product/${removeVietnameseTones(option)}`, { state: { option, type: 'type' } });
        }
    };

    const handleChangeByRate = async (option) => {
        if (option) {
            await navigate(`/product/${option}start`, { state: { option, type: 'rate' } });
        }
    };

    const handleChangeByPrice = async (option) => {
        const listOption = option.split('->');
        const convertListOption = listOption.map((item) => (item = Number(item.replace(/[,.](\d{3})/g, '$1'))));
        if (convertListOption) {
            await navigate(`/product/${convertListOption[0]}to${convertListOption[0][1]}`, {
                state: { option: convertListOption, type: 'price' },
            });
        }
    };

    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option, index) => {
                    return (
                        <li className={cx('nav-item', 'item')} key={index} onClick={() => handleChangByType(option)}>
                            <p className="name-type">{option}</p>
                        </li>
                    );
                });
            case 'checkbox':
                return options.map((option, index) => {
                    return (
                        <li className={cx('nav-item', 'item')} key={index} style={{ padding: '5px 0' }}>
                            <input type="checkbox" />
                            <label>{option.label}</label>
                        </li>
                    );
                });
            case 'rate':
                return options.map((option, index) => {
                    return (
                        <li
                            className={cx('nav-item', 'item')}
                            key={index}
                            style={{ padding: '5px 0' }}
                            onClick={() => handleChangeByRate(option)}
                        >
                            <Rate disabled defaultValue={option} className={cx('star')} />
                            {isMobile ? '' : <label style={{ cursor: 'pointer' }}>Từ {option} sao</label>}
                        </li>
                    );
                });
            case 'price':
                return options.map((option, index) => {
                    return (
                        <li
                            className={cx('nav-item', 'item')}
                            key={index}
                            style={{ padding: '5px 0' }}
                            onClick={() => handleChangeByPrice(option)}
                        >
                            <div className={cx('price', 'rounded-pill')}>{option}</div>
                        </li>
                    );
                });
            default:
                return {};
        }
    };

    const ResponsiveMobie = () => {
        return (<div style={{display: 'flex'}} className={cx('mobile-wrapper')}>
            <div style={{flex: '1', borderLeft: '2px solid #efefef'}}>
                <span className={cx('nav-title')}>Danh mục</span>
                {renderContent('text', typeProduct)}
            </div>
            <div style={{flex: '1.3'}}>
                <span className={cx('nav-title')}>Đánh giá</span>
                {renderContent('rate', [1, 2, 3, 4, 5])}                   
            </div>
            <div style={{flex: '1'}}>
                <span className={cx('nav-title')}>Giá</span>
                {renderContent('price', [
                            '0->1.000.000',
                            '1.000.000->5.000.000',
                            '5.000.000->10.000.000',
                            '10.000.000->',
                        ])}
            </div>
        </div>)
    }

    console.log(isMobile)

    return isMobile ? <ResponsiveMobie /> : (
        <div className="col-3">
            <nav className={cx('navbar')}>  
                <ul className="navbar-nav" style={{ width: '100%' }}>
                    <span className={cx('nav-title')}>Danh mục</span>
                    {renderContent('text', typeProduct)}
                    {/* <span className={cx('nav-title')}>Dịch vụ</span>
                    {renderContent('checkbox', [
                        { value: 'a', label: 'A' },
                        { value: 'b', label: 'B' },
                    ])} */}
                    <span className={cx('nav-title')}>Đánh giá</span>
                    {renderContent('rate', [1, 2, 3, 4, 5])}
                    <span className={cx('nav-title')}>Giá</span>
                    {renderContent('price', [
                        '0->1.000.000',
                        '1.000.000->5.000.000',
                        '5.000.000->10.000.000',
                        '10.000.000->',
                    ])}
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;
