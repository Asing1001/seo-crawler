import test from 'ava';
import sinon from 'sinon';
import { initialize, makeValidFileName } from './crawler';
import * as fsExtra from 'fs-extra';

let sandbox;

test.beforeEach(() => {
    sandbox = sinon.sandbox.create();
});

test.afterEach(() => sandbox.restore());

test('initialize without error', async t => {
    await initialize({ startUrl: 'http://acstatic.azurewebsites.net/' });
    t.pass();
});

test('makeValidFileName', t => {
    const url = "https://www.188bet.com/zh-cn/live/lobby?partnerId=9&partnerName=Grand-Suite&playfor=real&&gameType="
    const expect = '/zh-cn/live/lobby_partnerId=9&partnerName=Grand-Suite&playfor=real&&gameType='
    t.deepEqual(makeValidFileName(url), expect)
});