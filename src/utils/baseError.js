class BaseError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.name = this.constructor.name;
  }

  static UnauthorizedError() {
    return new BaseError(401, "Foydalanuvchiga ruxsat berilmagan");
  }

  static BadRequest(message, errors = []) {
    return new BaseError(400, message, errors);
  }

  static NotFoundError(message) {
    return new BaseError(404, message);
  }

  static ConflictError(message) {
    return new BaseError(409, message);
  }

  static InternalServerError(message) {
    // 500 xatolikni yaratish
    return new BaseError(500, `500 Internal Server Error: ${message}`);
  }
}

module.exports = BaseError;
