import classNames from 'classnames/bind';
import styles from './CardComponent.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function CardComponent({ props, item4, id }) {
    const navigate = useNavigate();
    let itemPerRow = 'col-sm-2';

    if (item4) {
        itemPerRow = 'col-sm-3';
    }

    //con loi o day
    const handleDetailProduct = () => {
        navigate(`/product-details/${id}`);
    };

    return (
        <div className={itemPerRow} style={{ marginTop: '12px', cursor: 'pointer' }} onClick={handleDetailProduct}>
            <div className={cx('card', 'bodered', 'card-item')}>
                <img
                    className="card-img-top"
                    src={props?.image}
                    alt="Card"
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                    <h4 className={cx('title', 'card-title')}>{props?.name}</h4>
                    <p className={cx('card-info')}>
                        <span>
                            {props?.rating}
                            <FontAwesomeIcon icon={faStar} className={cx('rate')} />
                        </span>
                        <span className={cx('sold')}>Đã bán {props?.selled || 1000}+</span>
                    </p>
                    <p className={cx('cost')}>
                        <span className={cx('price')}>{props?.price.toLocaleString()}đ</span>
                        {props?.disCount === 0 ? '' : <span className={cx('discount')}>-{props?.disCount}%</span>}
                    </p>

                    <p className="card-text">Made in VietNam</p>
                </div>
            </div>
        </div>
    );
}

export default CardComponent;
