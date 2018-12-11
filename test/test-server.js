//import chai
const chai = require("chai");

//import chai-http
const chaiHttp = require("chai-http");

//import app, runServer and closeServer from the file server.js
const { app, runServer, closeServer } = require('../server');

//to use to compare the response object
const expect = chai.expect;

chai.use(chaiHttp);

//Test blog post
describe("blog-post", function(){

before(function(){
    return runServer();
});

after(function(){
    return closeServer();
});

it("GET METHOD worked. Get list items", function(){
    return chai
        .request(app)
        .get("/blog-post")
        .then(function(res){
            expect(res).to.have.status(200);
            expect(res).to.be.json;

            // because we create items on app load
            expect(res.body.length).to.be.at.least(1);
            
            const expectedKeys = ['id','title','content','author','publishDate'];

            res.body.forEach(function(item){
                expect(item).to.include.keys(expectedKeys);
            });
        });
    });

it("POST Method Successful. Pushes hard coded data into blog post", function(){
    const newItem = {'title':"One Punch man", 'content':"anime",'author':"Some Japanese Guy",'publishDate':"Early 2000s"};
    return chai.request(app)
        .post('/blog-post')
        .send(newItem)
        .then(function(res){
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('id','title','content','author','publishDate');
            expect(res.body.id).to.not.equal(null);

            expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}))
        });
    });

    it("PUT Method Successful. Updates blog list post with an ID", function(){
        const updateData = {
            title: 'Successful',
            content: 'Rap Music',
            author:'Drake',
            publishDate: '2000'
        };

        return chai.request(app)
            .get('/blog-post')
            .then(function(res){
                updateData.id = res.body[0].id;
                return chai.request(app)
                    .put(`/blog-post/${updateData.id}`)
                    .send(updateData)
            })
            .then(function(res){
                expect(res).to.have.status(204);
            });
    });

    it("DELETE Method Successful. Deletes blog post list with an ID", function(){
        return chai.request(app)
            .get('/blog-post')
            .then(function(res){
                return chai.request(app)
                    .delete(`/blog-post/${res.body[0].id}`);
            })
            .then(function(res){
                expect(res).to.have.status(204);
            });
    });



});