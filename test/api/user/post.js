process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../app');
const conn = require('../../../src/db/db-conn');


describe('POST /user/login', () => {
    before((done) => {
        conn.connection().then(() => {
            done();
        }).catch(err => {
            done(err);
        });
    });

    after((done) => {
        conn.close()
            .then(() => done())
            .catch((err) => done(err));
    });

    it('Error while logging in', (done) => {
        request(app).post('/user/login')
            .send({
                'username': 'bandhan.roy5@gmail.com',
                'password': 'Bandhan@1234'
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('status');
                expect(body).to.contain.property('message');
                done();
            }).catch((err) => {
                done(err);
            });
    });

    it('Success while registering', (done) => {
        request(app).post('/user/register')
            .send({
                'username': 'bandhan.roy10@gmail.com',
                'password': 'Bandhan@1234'
            })
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('status');
                expect(body.status).to.equal(200);
                expect(body).to.contain.property('message');
                expect(body).to.contain.property('data');
                done();
            }).catch((err) => {
                done(err);
            });
    })


    // it('Proper response while logging out', (done) => {
    //     request(app).patch('/user/logout')
    //         .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMDJhZDc2YWRjMzI0MGRkNzVmMWE5ZiIsImlhdCI6MTYxMDc5NjM1MCwiZXhwIjoxNjE1OTgwMzUwfQ.bNPNIM9io8FoCUf5mjab4mXeiGxW9K0soKwrxOINOwY')
    //         .then((res) => {
    //             const body = res.body;
    //             expect(body).to.contain.property('status');
    //             expect(body.status).to.equal(200);
    //             expect(body).to.contain.property('message');
    //             expect(body).to.contain.property('data');
    //             done();
    //         }).catch((err) => {
    //             console.error('Error while testing patch');
    //             done(err);
    //         })
    // })

})
