import classNames from 'classnames/bind';
import styles from './Input.mudule.scss';

const cx = classNames.bind(styles);

function InputComponent(props) {
    let classes = cx('form-control', 'input');

    if (props.className) {
        classes = cx({ [props.className]: props.className });
    }

    return (
        <input
            type={props.type}
            id={props.id}
            className={classes}
            placeholder={props.placeholder}
            style={props.style}
            onChange={props.onInputChange}
            value={props.value}
            disabled={props.disabled}
        />
    );
}

export default InputComponent;
