import { AppstoreOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useState } from 'react';
import AdminOrders from '~/components/AdminOrders/AdminOrders';
import AdminProduct from '~/components/AdminProduct/AdminProduct';
import AdminUser from '~/components/AdminUser/AdminUser';
import HeaderComponent from '~/components/HeaderComponent/HeaderComponent';

const items = [
    {
        key: '1',
        icon: <UserOutlined />,
        label: 'Người dùng',
        // children: [
        //     {
        //         key: '11',
        //         label: 'Option 1',
        //     },
        //     {
        //         key: '12',
        //         label: 'Option 2',
        //     },
        //     {
        //         key: '13',
        //         label: 'Option 3',
        //     },
        //     {
        //         key: '14',
        //         label: 'Option 4',
        //     },
        // ],
    },
    {
        key: '2',
        icon: <AppstoreOutlined />,
        label: 'Sản phẩm',
        // children: [
        //     {
        //         key: '21',
        //         label: 'Option 1',
        //     },
        //     {
        //         key: '22',
        //         label: 'Option 2',
        //     },
        //     {
        //         key: '23',
        //         label: 'Submenu',
        //         children: [
        //             {
        //                 key: '231',
        //                 label: 'Option 1',
        //             },
        //             {
        //                 key: '232',
        //                 label: 'Option 2',
        //             },
        //             {
        //                 key: '233',
        //                 label: 'Option 3',
        //             },
        //         ],
        //     },
        //     {
        //         key: '24',
        //         label: 'Submenu 2',
        //         children: [
        //             {
        //                 key: '241',
        //                 label: 'Option 1',
        //             },
        //             {
        //                 key: '242',
        //                 label: 'Option 2',
        //             },
        //             {
        //                 key: '243',
        //                 label: 'Option 3',
        //             },
        //         ],
        //     },
        // ],
    },
    {
        key: '3',
        icon: <ShoppingCartOutlined />,
        label: 'Đơn hàng',
        //     children: [
        //         {
        //             key: '31',
        //             label: 'Option 1',
        //         },
        //         {
        //             key: '32',
        //             label: 'Option 2',
        //         },
        //         {
        //             key: '33',
        //             label: 'Option 3',
        //         },
        //         {
        //             key: '34',
        //             label: 'Option 4',
        //         },
        //     ],
    },
];
// const getLevelKeys = (items1) => {
//     const key = {};
//     const func = (items2, level = 1) => {
//         items2.forEach((item) => {
//             if (item.key) {
//                 key[item.key] = level;
//             }
//             if (item.children) {
//                 func(item.children, level + 1);
//             }
//         });
//     };
//     func(items1);
//     return key;
// };
// const levelKeys = getLevelKeys(items);

function AdminPage() {
    const [keySelected, setKeySelected] = useState('1');
    // const [stateOpenKeys, setStateOpenKeys] = useState(['1']);
    // const onOpenChange = (openKeys) => {
    //     const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
    //     // open
    //     if (currentOpenKey !== undefined) {
    //         const repeatIndex = openKeys
    //             .filter((key) => key !== currentOpenKey)
    //             .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
    //         setStateOpenKeys(
    //             openKeys
    //                 // remove repeat key
    //                 .filter((_, index) => index !== repeatIndex)
    //                 // remove current level all child
    //                 .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
    //         );
    //     } else {
    //         // close
    //         setStateOpenKeys(openKeys);
    //     }
    // };
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
                        width: 256,
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
