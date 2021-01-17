process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../app');
const conn = require('../../../src/db/db-conn');


describe('POST /user/logout', () => {
    before((done) => {
        conn.connection();
        done();
    });

    after((done) => {
        conn.close();
        done();
    });

    it('Error while logging out', (done) => {
        request(app).patch('/user/logout')
            .set('Authorization', 'abcd')
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('status');
                expect(body).to.contain.property('message');
                expect(body).to.contain.property('data');
                done();
            }).catch((err) => {
                done(err);
            });
    });

    it('Proper response while logging out', (done) => {
        request(app).patch('/user/logout')
            .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMDJhZDc2YWRjMzI0MGRkNzVmMWE5ZiIsImlhdCI6MTYxMDc5NjM1MCwiZXhwIjoxNjE1OTgwMzUwfQ.bNPNIM9io8FoCUf5mjab4mXeiGxW9K0soKwrxOINOwY')
            .then((res) => {
                const body = res.body;
                expect(body).to.contain.property('status');
                expect(body.status).to.equal(200);
                expect(body).to.contain.property('message');
                done();
            }).catch((err) => {
                done(err);
            })
    })

})
