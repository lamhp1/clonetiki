import { Pagination } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import CardComponent from '~/components/CardComponent/CardComponent';
import Loading from '~/components/loadingComponent/Loading';
import Navbar from '~/components/Navbar/Navbar';
import useDebounce from '~/hooks/useDebounce';
import { getProductByPrice, getProductByRate, getProductByType } from '~/services/ProductService';

function TypeProductPage() {
    const searchProduct = useSelector((state) => state?.product?.search);
    const searchDebounce = useDebounce(searchProduct, 500);
    const location = useLocation();
    const [products, setProducts] = useState();
    const [loading, setLoading] = useState(false);
    const [fetchPanigation, setFetchPanigation] = useState({
        page: 0,
        limit: 8,
    });
    const [totalProducts, setTotalProduct] = useState();

    const fetchProductByType = async (type, page, limit) => {
        setLoading(true);
        const res = await getProductByType(type, limit, page);
        if (res?.status === 'OK') {
            // console.log('res', res);
            setProducts(res?.data);
            setTotalProduct(res?.totalFilterProducts);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const fetchProductByRate = async (rate, page, limit) => {
        setLoading(true);
        const res = await getProductByRate(rate, limit, page);
        if (res?.status === 'OK') {
            // console.log('res', res);
            setProducts(res?.data);
            setTotalProduct(res?.totalFilterProducts);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const fetchProductByPrice = async (price, page, limit) => {
        setLoading(true);
        const res = await getProductByPrice(price, limit, page);
        if (res?.status === 'OK') {
            // console.log('res', res);
            setProducts(res?.data);
            setTotalProduct(res?.totalFilterProducts);
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (location?.state.type === 'type') {
            fetchProductByType(location?.state.option, fetchPanigation?.page, fetchPanigation?.limit);
        }
        if (location?.state.type === 'rate') {
            fetchProductByRate(location?.state.option, fetchPanigation?.page, fetchPanigation?.limit);
        }
        if (location?.state.type === 'price') {
            fetchProductByPrice(location?.state.option, fetchPanigation?.page, fetchPanigation?.limit);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location?.state]);

    const handlePagination = (page) => {
        const toPage = page - 1;
        fetchProductByType(location?.state, toPage, fetchPanigation?.limit);
        setFetchPanigation((prev) => {
            return {
                ...prev,
                page: toPage,
            };
        });
    };

    return (
        <Loading isPending={loading}>
            <div className="row" style={{ padding: '0 120px' }}>
                <Navbar />
                <div className="col-9">
                    <div className="row">
                        {products
                            // eslint-disable-next-line array-callback-return
                            ?.filter((item) => {
                                if (searchDebounce === '') {
                                    return item;
                                } else if (item?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase().trim())) {
                                    return item;
                                }
                            })
                            .map((product) => {
                                return <CardComponent item4 key={product?._id} id={product?._id} props={product} />;
                            })}
                    </div>
                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                        <Pagination
                            defaultCurrent={fetchPanigation?.page + 1}
                            total={totalProducts}
                            pageSize={fetchPanigation?.limit}
                            onChange={handlePagination}
                        />
                    </div>
                </div>
            </div>
        </Loading>
    );
}

export default TypeProductPage;
