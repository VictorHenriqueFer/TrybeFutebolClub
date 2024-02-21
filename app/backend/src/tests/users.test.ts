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
        sinon.stub(SequelizeUsers, 'findOne').resolves(null)
        const { status, body } = await chai.request(app).get('/login');
        expect(status).to.equal(400);
        expect(body).to.deep.equal({ message: 'Invalid email' });
    }
    );
    afterEach(sinon.restore);
});

