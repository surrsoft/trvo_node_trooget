const fs = require('fs');
const config = require('./config');
const path = require('path');
const tpuf = require('./tpuf_metanode');
const readline = require('readline');

//---
const ptdoFileName = config.troogetPathRelative + '/' + 'j_ptdo.txt';

//---


//возвращает TRUE если термин [stZint] присутствует в [ptdo]
function exists(stZint) {
    const stPath = tpuf.pathAbsByRelative(ptdoFileName);
    console.log('stPath [' + stPath + ']');
    console.log('process.cwd ['+process.cwd+']');

    //---

    //const lineReader = readline.createInterface({
    //    input: fs.createReadStream(stPath)
    //});
    //
    //lineReader.on('line', (stLine) => {
    //    console.log('line [' + stLine + ']');
    //});


    //fs.readFile(stPath, function (err, data) {
    //    if (err) {
    //        console.log('VRR: err [' + err + '] //190809-091100');
    //        return false; //TODO
    //    } else {
    //        console.log('data ['+data+']');
    //    }
    //});

}

//---
exports.exists = exists;
