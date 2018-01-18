const chai = require('chai').use(require('chai-as-promised')).use(require('chai-http'));
const expect = chai.expect;
const app = require('../../server').listen(8080);
const db = require('../../database');
const request = chai.request(app);
const agent = chai.request.agent(app);
const agent2 = chai.request.agent(app);

describe('/api/currentuser', () => {
  beforeEach(() => {
    return db.connection.clear()
      .then(() => {
        return agent.post('/signup')
          .send({name: 'Hello World', email: 'hello@world.com', password: 'test'});
      })
      .then(() => {
        return agent2.post('/signup')
          .send({name: 'Hello World', email: 'test@person.com', password: 'test'});
      });
  });
  describe('GET', () => {
    it('Should return error when not logged in', (done) => {
      request.get('/api/currentuser')
        .end((err, res) => {
          expect(err).to.exist;
          done();
        });
    });
    it('Should return current user when logged in', (done) => {
      agent.get('/api/currentuser')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.not.redirect;
          expect(res.body).to.be.a('object');
          expect(res).to.be.json;
          let user = res.body;
          expect(user.id).to.exist;
          expect(user.createdAt).to.exist;
          expect(user.updatedAt).to.exist;
          expect(user.password).to.not.exist;
          expect(user.googleId).to.equal(null); // Since the user we created was not registered through Google OAuth
          expect(user.name).to.equal('Hello World');
          expect(user.email).to.equal('hello@world.com');
          expect(user.themeId).to.exist;
          expect(Object.keys(user).length).to.equal(7); // All keys listed above that should exist
          done();
        });
    });
    it('Should set user theme to one by default', (done) => {
      agent.get('/api/currentuser')
        .end((err, res) => {
          user = res.body;
          expect(user.themeId).to.equal(1);
          done();
        });
    });
  });
});