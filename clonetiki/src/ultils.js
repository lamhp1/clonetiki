export const isJsonString = (jsonString) => {
    try {
        JSON.parse(jsonString);
    } catch (e) {
        return false;
    }
    return true;
};

export const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export const renderOptions = (data) => {
    let arr = [];
    arr = data.map((item) => {
        return {
            value: item,
            label: item,
        };
    });
    arr.push({
        value: 'add-type',
        label: '--Thêm--',
    });
    return arr;
};

export const removeVietnameseTones = (str) => {
    // Chuyển đổi sang chữ thường
    str = str.toLowerCase();

    // Thay các ký tự có dấu bằng ký tự không dấu tương ứng
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Thay khoảng trắng bằng dấu gạch dưới
    str = str.replace(/\s+/g, '_');

    // Loại bỏ các ký tự đặc biệt khác nếu cần
    str = str.replace(/[^\w_]+/g, '');

    return str;
};

export const convertDate = (dateStr) => {
    const date = new Date(dateStr);

    // Lấy ngày, tháng, năm
    const day = String(date.getDate()).padStart(2, '0'); // Thêm '0' nếu ngày < 10
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, nên +1
    const year = date.getFullYear();

    // Lấy giờ và phút
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Kết quả dạng dd/mm/yyyy giờ:phút
    const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}`;

    return formattedDateTime;
};

export const FacebookPlugins = () => {
    if (window.FB) {
        window.FB.XFBML.parse();
    }
    let locale = 'vi_VN';
    // Load Facebook SDK
    window.fbAsyncInit = function () {
        window.FB.init({
            appId: process.env.REACT_APP_FB_ID,
            cookie: true,
            xfbml: true,
            version: 'v16.0',
        });
    };

    (function (d, s, id) {
        var js,
            fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = `https://connect.facebook.net/${locale}/sdk.js`;
        fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
};
