import TypeProduct from '~/components/TypeProduct/TypeProduct';
import classNames from 'classnames/bind';
import styles from './HomePage.module.scss';
import Slider from '~/components/SliderComponent/SliderComponent';
import CardComponent from '~/components/CardComponent/CardComponent';
import Button from '~/components/ButtonComponent/ButtonComponent';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getAllProduct, getAllTypeProduct } from '~/services/ProductService';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import useDebounce from '~/hooks/useDebounce';
import { useMediaQuery } from 'react-responsive';

const cx = classNames.bind(styles);

function HomePage() {
    const searchProduct = useSelector((state) => state?.product?.search);
    const searchDebounce = useDebounce(searchProduct, 500);
    const [limit, setLimit] = useState(6);
    const [typeProduct, setTypeProduct] = useState([]);

    const fetchAllProduct = async (context) => {
        const limit = context?.queryKey && context?.queryKey[1];
        const search = context?.queryKey && context?.queryKey[2];
        const res = await getAllProduct(search, limit);
        return res;
    };

    const fetchAllTypeProduct = async () => {
        const res = await getAllTypeProduct();
        if (res?.status === 'OK') {
            setTypeProduct(res?.data);
        }
    };

    const { data: product, isPlaceholderData } = useQuery({
        queryKey: ['products', limit, searchDebounce],
        queryFn: fetchAllProduct,
        retry: 3,
        retryDelay: 1000,
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        fetchAllTypeProduct();
    }, []);

    //responsive
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
    const isMobile = useMediaQuery({ maxWidth: 767 });

    return (
        <div>
            <div className={cx('product-wrapper')}>
                {typeProduct.map((item) => {
                    return <TypeProduct type={item} key={item} />;
                })}
            </div>
            <div className={cx('wrapper')}>
                <div className={cx('slider')}>
                    <Slider />
                </div>
                <div className="row">
                    {product?.data?.map((product) => (
                        <CardComponent key={product?._id} props={product} id={product?._id} item3={isTablet} item2={isMobile} />
                    ))}
                </div>
                <Button
                    outline
                    className={cx('btn-more')}
                    onClick={() => setLimit((prev) => prev + 6)}
                    disabled={isPlaceholderData || product?.totalProducts <= limit || product?.totalPages === 1}
                >
                    {isPlaceholderData ? 'Loading' : 'Xem thêm'}
                </Button>
            </div>
        </div>
    );
}

export default HomePage;
