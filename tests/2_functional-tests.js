/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  /*
  * ----[END of EXAMPLE TEST]----
  */
  let bookId1 = "";
  const fakeId = "671bc0f70bd88600129a2d82";

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', () => {
      
      test('Test POST /api/books with title', done => {
        chai.request(server).post("/api/books").send({title: "Test Book"}).end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body, "res should be json");
          assert.property(res.body, "title", "Book should have title");
          assert.strictEqual(res.body.title, "Test Book", "Book title should match given title");
          assert.property(res.body, "_id", "Book should have ID");
          bookId1 = res.body._id;
          done();
        });
      });
      
      test('Test POST /api/books with no title given', done => {
        chai.request(server).post("/api/books").send({}).end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, "missing required field title");
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', () => {
      
      test('Test GET /api/books', done => {
        chai.request(server).get("/api/books").end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isArray(res.body, "Res should be array");
          assert.property(res.body[0], "_id", "Books in array should have IDs");
          assert.property(res.body[0], "title", "Books in array should have titles");
          assert.property(res.body[0], "commentcount", "Books in array should have comment counts");
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', () => {
      
      test('Test GET /api/books/[id] with id not in db', done => {
        chai.request(server).get(`/api/books/${fakeId}`).end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, "no book exists");
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db', done => {
        chai.request(server).get(`/api/books/${bookId1}`).end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body, "Res should be object");
          assert.property(res.body, "_id", "Book should have ID");
          assert.strictEqual(res.body._id, bookId1, "Book ID should match given ID");
          assert.property(res.body, "title", "Book should have title");
          assert.strictEqual(res.body.title, "Test Book", "Book title should match title for given ID");
          assert.property(res.body, "comments", "Book should have comments list");
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', () => {
      
      test('Test POST /api/books/[id] with comment', done => {
        chai.request(server).post(`/api/books/${bookId1}`).send({comment: "Test Comment"}).end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body, "Res should be object");
          assert.property(res.body, "_id", "Book should have ID");
          assert.strictEqual(res.body._id, bookId1, "Book ID should match given ID");
          assert.property(res.body, "title", "Book should have title");
          assert.strictEqual(res.body.title, "Test Book", "Book title should match title for given ID");
          assert.property(res.body, "comments", "Book should have comments list");
          assert.strictEqual(res.body.comments.length, 1, "Comment should have been added");
          assert.strictEqual(res.body.comments[0], "Test Comment", "Added comment should match given comment");
          done();
        });
      });

      test('Test POST /api/books/[id] without comment field', done => {
        chai.request(server).post(`/api/books/${bookId1}`).send({}).end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, "missing required field comment");
          done();
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', done => {
        chai.request(server).post(`/api/books/${fakeId}`).send({comment: "Test Comment"}).end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, "no book exists");
          done();
        });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', () => {

      test('Test DELETE /api/books/[id] with valid id in db', done => {
        chai.request(server).delete(`/api/books/${bookId1}`).end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, "delete successful");
          done();
        });
      });

      test('Test DELETE /api/books/[id] with  id not in db', done => {
        chai.request(server).delete(`/api/books/${fakeId}`).end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, "no book exists");
          done();
        });
      });

    });

  });

});
