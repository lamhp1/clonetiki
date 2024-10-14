import { Drawer } from 'antd';

function DrawerComponent({ title = 'Drawer', placement = 'right', isOpen = 'false', children, ...rest }) {
    return (
        <>
            <Drawer title={title} placement={placement} open={isOpen} {...rest}>
                {children}
            </Drawer>
        </>
    );
}

export default DrawerComponent;
