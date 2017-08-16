import test from 'ava';
import sinon from 'sinon';
import { start,makeValidFileName } from './crawler';
import * as fs from 'fs';
const { URL } = require('url');


let sandbox = sinon.sandbox.create(); 
let stubWriteFile;

test.beforeEach(() => {
    // stubWriteFile = sandbox.stub(fs, 'writeFile');
});

test.afterEach(() => sandbox.restore());

test('crawlPage', async t => {
    await start({url:'https://www.188bet.com/en-gb'});
    // sandbox.assert.calledOnce(stubWriteFile);
});

test('makeValidFileName', async t => {
    const url = "https://www.188bet.com/zh-cn/live/lobby?partnerId=9&partnerName=Grand-Suite&playfor=real&&gameType="
    const expect = '/zh-cn/live/lobby_partnerId=9&partnerName=Grand-Suite&playfor=real&&gameType='
    t.deepEqual(makeValidFileName(url),expect)
    // sandbox.assert.calledOnce(stubWriteFile);
});