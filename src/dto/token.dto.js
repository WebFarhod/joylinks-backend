class TokenDto {
  constructor(user) {
    this.sub = user.id.toString();
    this.phone = user.phone;
    this.role = user.role;
  }
}

module.exports = TokenDto;
