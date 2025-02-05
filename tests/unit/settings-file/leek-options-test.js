'use strict';

const expect = require('chai').expect;
const MockUI = require('console-ui/mock');
const Yam = require('yam');
const cliEntry = require('../../../lib/cli');
const broccoliTestHelper = require('broccoli-test-helper');

const createBuilder = broccoliTestHelper.createBuilder;
const createTempDir = broccoliTestHelper.createTempDir;

describe('.ember-cli leek options', function () {
  let passedOptions, leekConfigFolder;

  before(async function () {
    leekConfigFolder = await createTempDir();

    leekConfigFolder.write({
      '.ember-cli': JSON.stringify({
        leekOptions: {
          adapterUrls: {
            event: 'http://www.example.com/event',
            exception: 'http://www.example.com/error',
            timing: 'http://www.example.com/timing',
            appview: 'http://www.example.com/track',
          },
        },
      }),
    });

    let primaryPath = leekConfigFolder.path();

    await createBuilder(primaryPath).build();

    let mockedYam = new Yam('ember-cli', {
      primary: primaryPath,
    });

    let mockedLeek = function (options) {
      passedOptions = options;
    };

    cliEntry({
      UI: MockUI,
      Leek: mockedLeek,
      Yam: mockedYam,
    });
  });

  after(async function () {
    await leekConfigFolder.dispose();
  });

  it('should contain the leek options from .ember-cli file', function () {
    expect(passedOptions.adapterUrls).to.contain.keys(['event', 'exception', 'timing', 'appview']);
  });
});
