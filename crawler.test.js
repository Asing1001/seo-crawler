import test from 'ava';
import sinon from 'sinon';
import { start, makeValidFileName } from './crawler';

let sandbox = sinon.sandbox.create();
let stubWriteFile;

test.beforeEach(() => {

});

test.afterEach(() => sandbox.restore());

test('crawlPage', async t => {
    // await start({ url: 'https://www.188bet.com/en-gb' });
});

test('makeValidFileName', async t => {
    const url = "https://www.188bet.com/zh-cn/live/lobby?partnerId=9&partnerName=Grand-Suite&playfor=real&&gameType="
    const expect = '/zh-cn/live/lobby_partnerId=9&partnerName=Grand-Suite&playfor=real&&gameType='
    t.deepEqual(makeValidFileName(url), expect)
});