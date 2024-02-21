import * as sinon from 'sinon';
import * as chai from 'chai';

// @ts-ignore
import chaiHttp = require('chai-http');

import { App } from '../app';
import SequelizeUsers from '../database/models/SequelizeUsers';


chai.use(chaiHttp);
 const { app } = new App

const { expect } = chai;

describe('Users Test', function() {
    it('Testa se ao passar um email invalido retorna um erro', async function() {
        const { status, body } =  await chai.request(app).post('/login').send({ email: 'invalidemail@email.com', password: '123456' });
        expect(status).to.equal(401);
        expect(body).to.deep.equal({ message: 'Invalid email or password' });
    })
    it('Testa se ao passar um email valido e senha invalida retorna um erro', async function() {
        const { status, body } =  await chai.request(app).post('/login')
        .send({ email: 'user@user.com',
        password: '123456' });
        expect(status).to.equal(401);
        expect(body).to.deep.equal({ message: 'Invalid email or password' });
    })
    it.only('Testa se ao passar um email valido e senha valida retorna um token', async function() {
        const { status, body } =  await chai.request(app).post('/login')
        .send({ email: "user@user.com",
        password: "secret_user"
        });
        console.log(body)
        expect(status).to.equal(500);
        expect(body).to.have.property('token');
    });
    afterEach(sinon.restore);
});

