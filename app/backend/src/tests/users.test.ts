import * as sinon from 'sinon';
import * as chai from 'chai';

// @ts-ignore
import chaiHttp = require('chai-http');

import { App } from '../app';
import SequelizeTeams from '../database/models/SequelizeTeams'
import { teams, team } from './mocks/Teams.mock';


chai.use(chaiHttp);
 const { app } = new App

const { expect } = chai;
