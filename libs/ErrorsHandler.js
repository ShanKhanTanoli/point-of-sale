const ERROR_CODE = require('./ErrorCodes');

/**
 * It will return errors
 * @param {*} err 
 * @param {*} custom_message 
 * @returns Object
 */
module.exports = function handleErrors(err, custom_message = '') {
    switch (err.code) {
        case ERROR_CODE.DUPLICATE_ENTRY:
            console.error('❌ Duplicate entry:', err.sqlMessage);
            return {
                status: 'error',
                code: ERROR_CODE.DUPLICATE_ENTRY,
                message: custom_message == '' ? 'Already added.' : custom_message,
                status_code: 409
            };

        case ERROR_CODE.NULL_VALUE:
            console.error('❌ Required field missing:', err.sqlMessage);
            return {
                status: 'error',
                code: ERROR_CODE.NULL_VALUE,
                message: custom_message == '' ? 'Please enter.' : custom_message,
                status_code: 422
            };

        case ERROR_CODE.FOREIGN_KEY_FAIL:
            console.error('❌ Foreign key constraint failed:', err.sqlMessage);
            return {
                status: 'error',
                code: ERROR_CODE.FOREIGN_KEY_FAIL,
                message: custom_message == '' ? 'Invalid foreign key reference.' : custom_message,
                status_code: 500
            };

        default:
            console.error('❌ Unknown DB error:', err.message || err);
            return {
                status: 'error',
                code: err.code || ERROR_CODE.UNKNOWN,
                message: custom_message == '' ? err.message : custom_message,
                status_code: 500
            };
    }
};
