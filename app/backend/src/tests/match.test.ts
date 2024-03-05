import * as sinon from 'sinon';
import * as chai from 'chai';

// @ts-ignore
import chaiHttp = require('chai-http');

import { App } from '../app';
import SequelizeUsers from '../database/models/SequelizeUsers';
import { before } from 'mocha'


chai.use(chaiHttp);
 const { app } = new App()

const { expect } = chai;



describe('Matches Test', function() {
    let auth: string;
    before(async function() {
        const {body:{token}}= await chai.request(app).post('/login').send({ email: 'admin@admin.com', password: 'secret_admin' });
        auth = token;
    })

    it('Testa se retorna todas as matches', async function() {
        const { status, body } =  await chai.request(app).get('/matches');
        expect(status).to.equal(200);
        expect(body).to.be.an('array');
        expect(body).to.have.lengthOf(48);
    })
    it('Testa se retorna todas as matches em progresso', async function() {
        const { status, body } =  await chai.request(app).get('/matches?inProgress=true');
        expect(status).to.equal(200);
        expect(body).to.be.an('array');
        expect(body).to.have.lengthOf(8);
    })
    it('Testa se ao passar um id de match finaliza a partida', async function() {
        const { status, body } =  (await chai.request(app).patch('/matches/1/finish').set('Authorization', `Bearer ${auth}`))
        expect(status).to.equal(200);
        expect(body).to.deep.equal({ message: 'Finished' });
    })
    it('Testa se ao passar um id de match e um resultado atualiza o resultado da partida', async function() {
        const { status, body } =  (await chai.request(app).patch('/matches/15').set('Authorization', `Bearer ${auth}`).send({homeTeamGoals: 2, awayTeamGoals: 1}))
        expect(status).to.equal(200);
        expect(body).to.deep.equal({ 
            id: 15,
            homeTeamId: 10,
            homeTeamGoals: 0,
            awayTeamId: 15,
            awayTeamGoals: 1,
            inProgress: 0,
            home_team_id: 10,
            away_team_id: 15

           });
    })
    it('Testa se ao passar um id de resultado errado retorna erro', async function() {
        const { status, body } =  (await chai.request(app).patch('/matches/100').set('Authorization', `Bearer ${auth}`).send({homeTeamGoals: 2}))
        expect(status).to.equal(400);
        expect(body).to.deep.equal({ message: 'Error' });
    });
    it('Testa se ao criar uma partida com um time que não existe retorna erro', async function() {
        const { status, body } =  (await chai.request(app).post('/matches').set('Authorization', `Bearer ${auth}`)
        .send({
            homeTeamId: 100, 
            awayTeamId: 1, 
            homeTeamGoals: 2,
            awayTeamGoals: 2
          }))
        expect(status).to.equal(404);
        expect(body).to.deep.equal({ message: 'There is no team with such id!' });
    });
    it('Testa se ao criar uma partida com um time visitabte que não existe retorna erro', async function() {
        const { status, body } =  (await chai.request(app).post('/matches').set('Authorization', `Bearer ${auth}`)
        .send({
            homeTeamId: 16, 
            awayTeamId: 100, 
            homeTeamGoals: 2,
            awayTeamGoals: 2
          }
          ))
        expect(status).to.equal(404);
        expect(body).to.deep.equal({ message: 'There is no team with such id!' });
    });
    it('Testa se ao criar uma partida com um time que já está em progresso retorna erro', async function() {
        const { status, body } =  (await chai.request(app).post('/matches').set('Authorization', `Bearer ${auth}`)
        .send({
            homeTeamId: 11, 
            awayTeamId: 10, 
            homeTeamGoals: 1,
            awayTeamGoals: 1
          }
          ))
        expect(status).to.equal(400);
        expect(body).to.deep.equal({ message: 'Match already in progress' });
    })
    it('Testa se ao criar um partida retorna a partida criada', async function() {
        const { status, body } =  (await chai.request(app).post('/matches').set('Authorization', `Bearer ${auth}`)
        .send({
            homeTeamId: 16, 
            awayTeamId: 1, 
            homeTeamGoals: 2,
            awayTeamGoals: 2
          }
          ))
        expect(status).to.equal(201);
        expect(body).to.have.property('id');
        expect(body).to.have.property('homeTeamId');
        expect(body).to.have.property('homeTeamGoals');
        expect(body).to.have.property('awayTeamId');
        expect(body).to.have.property('awayTeamGoals');
        expect(body).to.have.property('inProgress');
    })

    afterEach(sinon.restore);
});