import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

function PayPalComponent({ value, sendData }) {
    return (
        <PayPalScriptProvider options={{ 'client-id': `${process.env.REACT_APP_CLIENT_ID}` }}>
            <PayPalButtons
                style={{ layout: 'vertical' }}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: `${(value / 24000).toFixed(2)}`, // số tiền giao dịch
                                },
                            },
                        ],
                    });
                }}
                onApprove={(data, actions) => {
                    // console.log(data);
                    return actions.order.capture().then((details) => {
                        if (details?.status === 'COMPLETED') {
                            sendData(true, details?.update_time);
                        } else {
                            alert('Lỗi không xác định');
                        }
                    });
                }}
            />
        </PayPalScriptProvider>
    );
}

export default PayPalComponent;
