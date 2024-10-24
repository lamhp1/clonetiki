import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import styles from './ButtonInputSearch.module.scss';
import InputComponent from '~/components/Input/InputComponent';
import Button from '../ButtonComponent/ButtonComponent';

const cx = classNames.bind(styles);

function ButtonInputSearch(props) {
    return (
        <div className={cx('input-group', 'search')} style={{ flexWrap: 'nowrap' }}>
            <div className={cx('form-outline', { 'isMobile': props.isMobile })} style={{ width: '100%' }}>
                <InputComponent
                    type="search"
                    id="form1"
                    className={cx('form-control', 'input')}
                    placeholder="Tìm kiếm tại đây"
                    style={{ height: '32px' }}
                    onInputChange={props.onChange}
                    value={props.value}
                />
            </div>
            <Button search style={{minWidth: props.isMobile ? '50px' : ''}} > 
                <FontAwesomeIcon icon={faMagnifyingGlass} style={{ marginBottom: '16px', color: 'white' }} />
            </Button>
        </div>
    );
}

export default ButtonInputSearch;
