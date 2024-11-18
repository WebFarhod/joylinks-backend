class UserDto {
  constructor(user) {
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.phone = user.phone;
    this.role = user.role;
    this.biography = user.biography;
    this.photo = user.photo || null;
    this.balance = user.balance;
    this.region = user.region;
    this.district = user.district;
    this.birthdate = new Date(user.birthdate);
    this.gender = user.gender;
    this.isActive = user.isActive;
    this.isApproved = user.isApproved;
    this.isBlock = user.isBlock;
  }
}

module.exports = UserDto;
