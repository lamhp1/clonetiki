const { message } = require('antd');

const successMessage = (mes = 'Success') => {
    message.success(mes, [2]);
};

const errorMessage = (mes = 'error') => {
    message.error(mes, [2]);
};

const warningMessage = (mes = 'warning') => {
    message.warning(mes, [2]);
};

export { successMessage, errorMessage, warningMessage };
