import AdminPage from '~/pages/AdminPage/AdminPage';
import HomePage from '~/pages/HomePage/HomePage.js';
import NotFoundPage from '~/pages/NotFoundPage/NotFoundPage';
import OrderPage from '~/pages/OrderPage/OrderPage.js';
import ProductDetailPage from '~/pages/ProductDetailPage/ProductDetailPage';
import ProducePage from '~/pages/ProductPage/ProductPage.js';
import ProfilePage from '~/pages/ProfilePage/ProfilePage';
import SignInPage from '~/pages/SignInPage/SignInPage';
import SignUpPage from '~/pages/SignUpPage/SignUpPage';
import TypeProductPage from '~/pages/TypeProductPage/TypeProductPage';
import PaymentPage from '~/pages/PaymentPage/paymentPage';
import OrderSuccessPage from '~/pages/OrderSuccessPage/OrderSuccessPage';
import MyOrderPage from '~/pages/MyOrderPage/MyOrderPage';

const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true,
        isHiddenSearch: true
    },
    {
        path: '/payment',
        page: PaymentPage,
        isShowHeader: true,
        isHiddenSearch: true
    },
    {
        path: '/order-success',
        page: OrderSuccessPage,
        isShowHeader: true,
        isHiddenSearch: true
    },
    {
        path: '/products',
        page: ProducePage,
        isShowHeader: true,
    },
    {
        path: '/product/:type',
        page: TypeProductPage,
        isShowHeader: true,
    },
    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: false,
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false,
    },
    {
        path: '/product-details/:id',
        page: ProductDetailPage,
        isShowHeader: true,
        isHiddenSearch: true
    },
    {
        path: '/profile',
        page: ProfilePage,
        isShowHeader: true,
        isHiddenSearch: true
    },
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        isPrivate: false,
    },
    {
        path: '/my-order',
        page: MyOrderPage,
        isShowHeader: true,
        isHiddenSearch: true
    },
    {
        path: '*',
        page: NotFoundPage,
    },
];

export default routes;
