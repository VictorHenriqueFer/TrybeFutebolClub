
import * as sinon from 'sinon';
import * as chai from 'chai';

// @ts-ignore
import chaiHttp = require('chai-http');

import { App } from '../../app';
import SequelizeTeams from '../../database/models/SequelizeTeams'
import { teams, team } from '../mocks/Teams.mock';


chai.use(chaiHttp);
 const { app } = new App

const { expect } = chai;


describe('Teams Test', function() {
  it('retorna todos os teams', async function() {
    sinon.stub(SequelizeTeams, 'findAll').resolves( teams as any)
    const {status, body} = await chai.request(app).get('/teams')

    expect(status).to.equal(200);
    expect(body).to.deep.equal(teams)
  });
  it('deve devolver um team por id', async function() {
    sinon.stub(SequelizeTeams, 'findOne').resolves( team as any)
    const { status, body} = await chai.request(app).get('/teams/1')

    expect(status).to.equal(200);
    expect(body).to.deep.equal(team)
  })
  afterEach(sinon.restore);
});
