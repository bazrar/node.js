class AppError extends Error {
    constructor(statusCode, message) {
        super(message)
        this.statusCode = statusCode; 
        this.status = JSON.stringify(this.statusCode).startsWith('4') ? 'fail':'error'
        this.isOperational = true; 
        
        //capture stack trace 
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AppError