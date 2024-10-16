const nodemailer = require("nodemailer");
const dotenv = require('dotenv')

dotenv.config()
const sendOrderConfirmation = async (toEmail, createdOrder) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for port 465, false for other ports
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    try {
        const mailOptions = {
            from: process.env.MAIL_ACCOUNT, // địa chỉ email người gửi
            to: toEmail, // địa chỉ email người nhận
            subject: 'Xác nhận đơn hàng',
            html: `
                <h1>Thông tin đơn hàng của bạn</h1>
                <p>Cảm ơn bạn đã đặt hàng!</p>
                <p>Chi tiết đơn hàng:</p>
                <ul>
                    ${createdOrder?.orderItems.map((item) => `<li>${item.name} - Số lượng: ${item.amount} - Đơn giá: ${item.price} VND - Hình ảnh sản phẩm: ${item.image} </li>`).join('')}
                </ul>
                <p>Tổng tiền cần thanh toán: ${createdOrder?.totalPrice} VND - ${createdOrder?.isPaid ? `Đã thanh toán qua ${createdOrder.paymentMethod}` : 'Thanh toán sau khi nhận hàng'} </p>
                <p>Thông tin giao hàng:</p>
                <p>Tên người nhận: <strong>${createdOrder?.shippingAddress?.fullName}</strong></p>
                <p>Địa chỉ: <strong>${createdOrder?.shippingAddress?.address}</strong></p>
                <p>SĐT: <strong>${createdOrder?.shippingAddress?.phone}</strong></p>
                <p>Đơn vị giao hàng: <strong>${createdOrder?.deliveryMethod}</strong></p>
                <p>Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        // console.log('Email đã được gửi thành công!');
    } catch (error) {
        // console.error('Lỗi khi gửi email:', error);
    }
};

module.exports = sendOrderConfirmation;