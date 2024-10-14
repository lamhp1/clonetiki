import InputComponent from '../Input/InputComponent';
import classNames from 'classnames/bind';
import styles from './SignInputComponent.module.scss';

const cx = classNames.bind(styles);

function SignInputComponent(props) {
    return (
        <div className={cx('wrapper')}>
            <InputComponent
                type={props.type}
                placeholder={props.placeholder}
                className={cx('input')}
                onInputChange={props.onInputChange}
                value={props.value}
            />
        </div>
    );
}

export default SignInputComponent;
