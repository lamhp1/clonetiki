import { AppstoreOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import AdminOrders from '~/components/AdminOrders/AdminOrders';
import AdminProduct from '~/components/AdminProduct/AdminProduct';
import AdminUser from '~/components/AdminUser/AdminUser';
import HeaderComponent from '~/components/HeaderComponent/HeaderComponent';


function AdminPage() {
    const [keySelected, setKeySelected] = useState('1');

     //responsive
     const isMiniTablet = useMediaQuery({ minWidth: 768, maxWidth: 820 });
     const isMobile = useMediaQuery({ maxWidth: 767 });

    const items = [
        {
            key: '1',
            icon: <UserOutlined />,
            label: isMiniTablet || isMobile ? '' : 'Người dùng',
        },
        {
            key: '2',
            icon: <AppstoreOutlined />,
            label: isMiniTablet || isMobile ? '' : 'Sản phẩm',
        },
        {
            key: '3',
            icon: <ShoppingCartOutlined />,
            label: isMiniTablet || isMobile ? '' : 'Đơn hàng',
        },
    ];

    const handleClick = ({ keyPath }) => {
        setKeySelected(keyPath.join(''));
    };

    const handleChangeItems = (itemNumber) => {
        switch (itemNumber) {
            case '1':
                return <AdminUser />;
            case '2':
                return <AdminProduct />;
            case '3':
                return <AdminOrders />;
            default:
                return <></>;
        }
    };

     
    return (
        <>
            <HeaderComponent isHiddenSearch isHiddenCart />
            <div style={{ display: 'flex' }}>             
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    // openKeys={stateOpenKeys}
                    // onOpenChange={onOpenChange}
                    onClick={handleClick}
                    style={{
                        width: isMobile ? '100%' : isMiniTablet ? 150 : 256,
                        height: '100vh',
                        boxShadow: '1px 1px 2px #ccc',
                    }}
                    items={items}
                />
                <div style={{ flex: 1 }}>{handleChangeItems(keySelected)}</div>
            </div>
        </>
    );
}

export default AdminPage;
