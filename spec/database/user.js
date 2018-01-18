const expect = require('chai').use(require('chai-as-promised')).expect;
const {User, connection} = require('../../database');
const mockDB = require('./mockDB.json');
const mockDBHelpers = require('./mockDBHelpers');

describe('User', () => {
  beforeEach(() => {
    return connection.clear()
      .then(() => {
        return mockDBHelpers.createUsers();
      });
  });

  it('Should exist', () => {
    expect(User.model).to.exist;
  });
  describe('getByEmail', () => {
    it('Should exist', () => {
      expect(User.getByEmail).to.exist;
    });
    it('Should be a function', () => {
      expect(User.getByEmail).to.be.a('function');
    });
    it('Should retrieve a user if they exist', () => {
      let promise = User.getByEmail(mockDB.users[0].email)
        .then((user) => {
          expect(user.createdAt).to.exist;
          expect(user.updatedAt).to.exist;
          expect(user.themeId).to.exist;
          expect(user.password).to.not.exist;
          expect(user.email).to.equal(mockDB.users[0].email);
        });
    });
    it('Should set user theme to 1 by default', () => {
      let promise = User.getByEmail(mockDB.users[0].email)
        .then((user) => {
          expect(user.themeId).to.equal(1);
        });
    });
    it('Should reject if a user does not exist', () => {
      let fakeEmail = 'thisisafakeemail';
      return expect(User.getByEmail(fakeEmail)).to.be.rejectedWith('User does not exist');
    });
  });
  describe('changeTheme()', () => {
    it('Should change theme when valid theme and userId are supplied', () => {
      let user = mockDB.users[0];
      return User.changeTheme(user.id, 3)
        .then((user) => {
          expect(user.themeId).to.equal(3);
        });
    });
    it('Should not return user password', () => {
      let user = mockDB.users[0];
      return User.changeTheme(user.id, 3)
        .then((user) => {
          expect(user.password).to.not.exist;
        });
    });
    it('Should reject when userId does not map to an existing user', () => {
      return expect(User.changeTheme(13542, 4)).to.be.rejectedWith('User does not exist');
    });
    it('Should reject when themeId is not valid', () => {
      let user = mockDB.users[0];
      return expect(User.changeTheme(user.id, 1234)).to.be.rejectedWith('Theme ID must be a number between zero and');
    });
  });
  describe('getById()', () => {
    it('Should exist', () => {
      expect(User.getById).to.exist;
    });
    it('Should be a function', () => {
      expect(User.getById).to.be.a('function');
    });
    it('Should get a user by their ID', () => {
      return User.getById(mockDB.users[2].id)
        .then((user) => {
          expect(user.createdAt).to.exist;
          expect(user.updatedAt).to.exist;
          expect(user.themeId).to.exist;
          expect(user.email).to.equal(mockDB.users[2].email);
        });
    });
    it('Should not retrieve user password', () => {
      return User.getById(mockDB.users[2].id)
        .then((user) => {
          expect(user.password).to.not.exist;
        });
    });
    it('Should throw an error when passed in an invalid ID', () => {
      let ID = -1;
      return expect(User.getById(ID)).to.be.rejectedWith('User does not exist');
    });
    it('Should throw an error when passed in a non-number', () => {
      let ID = 'cat';
      return expect(User.getById(ID)).to.be.rejectedWith('User does not exist');
    });
  });
});