import HeaderComponent from '../HeaderComponent/HeaderComponent';

function DefaultComponent({ children, ...props }) {
    return (
        <div>
            <HeaderComponent {...props} />
            {children}
        </div>
    );
}

export default DefaultComponent;
