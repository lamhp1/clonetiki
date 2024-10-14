import { useNavigate, useParams } from 'react-router-dom';

import ProductDetailComponent from '~/components/ProductDetailComponent/ProductDetailComponent';

function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div style={{ padding: '0 120px', backgroundColor: '#efefef' }}>
            <h1 style={{ fontWeight: '300', fontSize: '16px', padding: '12px 0' }}>
                <span style={{ fontWeight: '400', cursor: 'pointer' }} onClick={() => navigate('/')}>
                    Trang chủ
                </span>{' '}
                - chi tiết sản phẩm
            </h1>
            <ProductDetailComponent idProduct={id} />
        </div>
    );
}

export default ProductDetailPage;
