import { useNavigate } from 'react-router-dom';
import { removeVietnameseTones } from '~/ultils';

function TypeProduct(props) {
    const { type: option } = props;

    const navigate = useNavigate();

    const handleToTypePage = async () => {
        await navigate(`/product/${removeVietnameseTones(option)}`, { state: { option, type: 'type' } });
    };

    return (
        <div style={{ fontSize: '14px', cursor: 'pointer' }} onClick={handleToTypePage}>
            {option}
        </div>
    );
}

export default TypeProduct;
