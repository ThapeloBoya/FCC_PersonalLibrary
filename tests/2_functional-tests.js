

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  let id;
  let title;
  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {

        //If the test fail, add a control time here

        chai
          .request(server)
          .post('/api/books')
          .send({
            title: 'Test book'
          })
          .end((err, res) => {
            id = res.body._id;
            title = res.body.title;
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'Test book');
            done();
            return;
          });
      });

      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .post('/api/books')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'missing required field title');
            done();
          });
      });

    });


    suite('GET /api/books => array of books', function() {

      test('Test GET /api/books', function(done) {
        chai.request(server)
          .get('/api/books')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            done();
          });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function() {

      test('Test GET /api/books/[id] with id not in db', function(done) {
        chai
          .request(server)
          .get('/api/books/this_is_not_a_valid_id')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function(done) {
        chai
          .request(server)
          .get('/api/books/' + id)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, id);
            done();
          })
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function() {

      test('Test POST /api/books/[id] with comment', function(done) {
        chai
          .request(server)
          .post('/api/books/' + id)
          .send({ comment: 'Test comment' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.comments[0], ['Test comment'])
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done) {
        chai
          .request(server)
          .post('/api/books/' + id)
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'missing required field comment')
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done) {
        chai
          .request(server)
          .post('/api/books/not_a_valid_id')
          .send({ comment: 'Test comment 2' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists')
            done();
          });
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done) {
        chai
          .request(server)
          .delete('/api/books/' + id)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'delete successful')
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done) {
        chai
          .request(server)
          .delete('/api/books/not_a_valid_id')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists')
            done();
          });
      });

    });

  });

  after(function() {
    chai.request(server)
      .get('/')
  });

});
