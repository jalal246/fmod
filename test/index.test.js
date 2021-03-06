/* eslint-env mocha */
import chai from 'chai';
import fs from 'fs';
import path from 'path';
import faker from 'faker';
// import assert from 'assert';

import replace from '../src';


const expect = chai.expect;

const fileExist = path.join(__dirname, 'tempFileExistForTest.txt');
const fwithoutInfo = path.join(__dirname, '.env.no.info.test');
const fwitInfoStack = path.join(__dirname, 'info.stk.docx');
const fwithInfoSpreaded = path.join(__dirname, 'info.sp.txt');

const LABLE1 = 'hi guys!';
const LABLE2 = 'what is up?';
const LABLE3 = 'is everything ok?';
const LABLE4 = 'good, glad to here that from you';
const LABLE5 = 'dont worry';
const LABLE6 = 'this test';
const LABLE7 = 'cannot be last forever';
const LABLE8 = 'right?';
const LABLE9 = 'what!!';

const pharse1 = { regex: LABLE1, replace: 'replace with new 1' };
const pharse2 = { regex: new RegExp(`${LABLE2}`), replace: 'replace with new 2' };
const pharse3 = { regex: LABLE3, replace: 'replace with new 3' };
const pharse4 = { regex: LABLE4, replace: 'replace with new 4' };
const pharse5 = { regex: new RegExp(`${LABLE5}`), replace: 'replace with new 5' };
const pharse6 = { regex: LABLE6, replace: 'replace with new 6' };
const pharse7 = { regex: LABLE7, replace: 'replace with new 7' };
const pharse8 = { regex: new RegExp(`${LABLE8}`), replace: 'replace with new 8' };
const pharse9 = { regex: /what!!/ig, replace: 'replace with new 9' };

const request = [
  pharse1,
  pharse2,
  pharse3,
  pharse4,
  pharse5,
  pharse6,
  pharse7,
  pharse8,
  pharse9,
];

// const vk = path.join(asym, PRIVATE_KEY_FILE_NAME);
describe('read and replace stream function', () => {
  describe('invalid parameters', () => {
    it('creates file to continue validation test', () => {
      fs.closeSync(fs.openSync(fileExist, 'w'));
    });
    it('throws error for invalid callback function', () => {
      // console.log(replace(fwithInfoSpreaded, [], 'test'));
      expect(() => replace(fileExist, [], 'test')).to.throw(Error);
    });
    describe('return callback error msg callback error', () => {
      it('for invalid directory', (done) => {
        replace('fileExist', '', (err) => {
          // console.log(err);
          expect(err).to.be.an('error');
          done();
        });
      });
      it('for invalid array of objects', (done) => {
        replace(fileExist, '', (err) => {
          expect(err).to.be.an('error');
          done();
        });
      });
      it('for empty array of objects', (done) => {
        replace(fileExist, [], (err) => {
          // console.log(err);
          expect(err).to.be.an('error');
          done();
        });
      });
      it('for invalid regex [regex or string]', (done) => {
        replace(fileExist, [{ regex: 8, replace: 'replace pharse' }], (err) => {
          // console.log(err);
          expect(err).to.be.an('error');
          done();
        });
      });
      it('for invalid replace pharse', (done) => {
        replace(fileExist, [{ regex: /d/g, replace: 9 }], (err) => {
          // console.log(err);
          expect(err).to.be.an('error');
          done();
        });
      });
      it('delete test file that was created for validation test', () => {
        fs.unlinkSync(fileExist);
      });
    });
  });
  describe('info spreaded in file', () => {
    it('create file with fake info', () => {
      // init file with params spreaded.
      const ws1 = fs.createWriteStream(fwithInfoSpreaded);
      for (let i = 0; i < 10000; i += 1) {
        if (i === 1000) {
          ws1.write(` ${LABLE1} `);
        } else if (i === 2000) {
          ws1.write(` ${LABLE2} `);
        } else if (i === 3000) {
          ws1.write(` ${LABLE3} `);
        } else if (i === 4000) {
          ws1.write(` ${LABLE4} `);
        } else if (i === 5000) {
          ws1.write(` ${LABLE5} `);
        } else if (i === 6000) {
          ws1.write(` ${LABLE6} `);
        } else if (i === 7000) {
          ws1.write(` ${LABLE7} `);
        } else if (i === 800) {
          ws1.write(` ${LABLE8} `);
        } else if (i === 800) {
          ws1.write(` ${LABLE9} `);
        } else {
          ws1.write(`${faker.lorem.paragraphs()}\n`);
        }
      }
      ws1.end();
    });
    it('replaces spreaded strings', (done) => {
      replace(fwithInfoSpreaded, request, (err, report) => {
        expect(report[0]).to.deep.equal({
          isChanged: true, regex: LABLE1, replace: 'replace with new 1',
        });
        done();
      });
    });
    it('delete test file', (done) => {
      fs.unlinkSync(fwithInfoSpreaded);
      done();
    });
  });
  describe('testing in not matching info file', () => {
    it('create file with fake info', () => {
      // init file with params spreaded.
      const ws2 = fs.createWriteStream(fwithoutInfo);
      for (let i = 0; i < 10000; i += 1) {
        ws2.write(`${faker.lorem.paragraphs()}\n`);
      }
      ws2.end();
    });
    it('returns isChanged false beacuse of not matching', (done) => {
      replace(fwithoutInfo, request, (err, report) => {
        expect(report[0]).to.deep.equal({
          isChanged: false, regex: LABLE1, replace: 'replace with new 1',
        });
        expect(report[7]).to.deep.equal({
          isChanged: false, regex: new RegExp(`${LABLE8}`), replace: 'replace with new 8',
        });
        done();
      });
    });
    it('delete test file', (done) => {
      fs.unlinkSync(fwithoutInfo);
      done();
    });
  });
  describe('testing in staching info file', () => {
    it('create file with fake info', () => {
      // init file with params spreaded.
      const ws3 = fs.createWriteStream(fwitInfoStack);
      ws3.write(` ${LABLE1} `);
      ws3.write(` ${LABLE2} `);
      ws3.write(` ${LABLE3} `);
      ws3.write(` ${LABLE4} `);
      ws3.write(` ${LABLE5} `);
      ws3.write(` ${LABLE6} `);
      ws3.write(` ${LABLE7} `);
      ws3.write(` ${LABLE8} `);
      ws3.write(` ${LABLE9} `);
      for (let i = 0; i < 10000; i += 1) {
        ws3.write(`${faker.lorem.paragraphs()}\n`);
      }
      ws3.end();
    });
    it('returns isChanged false beacuse of not matching', (done) => {
      replace(fwitInfoStack, request, (err, report) => {
        expect(report[0]).to.deep.equal({
          isChanged: true, regex: LABLE1, replace: 'replace with new 1',
        });
        done();
      });
    });
    it('delete test file', (done) => {
      fs.unlinkSync(fwitInfoStack);
      done();
    });
  });
});
