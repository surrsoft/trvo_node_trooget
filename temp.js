"use strict";

/* jshint esversion: 6 */

const axios = require('axios');
const nock = require('nock');

function fnRequest(_stComment, _stPath) {
    axios({
        method: 'get',
        url: _stPath
    })
        .then((res) => {
            console.log(`req-${_stComment} - success`, res.data); //del
        })
        .catch((err) => {
            console.log(`req-${_stComment} - error`); //del
        });
}

// --- nock
nock.disableNetConnect();
nock('http://example.com/')
    .get('/')
    .reply(200, { resp: 'ok' });

// ---
fnRequest('01', 'http://example.com/');

nock.cleanAll();
nock.enableNetConnect();

// fnRequest('02', '', 's');



