const mdFs = require('fs');
const mdReadline = require('readline');
const mdConfig = require('./config');
const mdPath = require('path');

//---
const ptdoFileName = mdConfig.troogetPathRelative + '/' + 'j_ptdo.txt';

//---

//возвращает TRUE если термин [stZint] присутствует в [ptdo]
function exists(stZint) {
    console.log('module V:');
    console.log(module);
    const stPath = '/'.concat(ptdoFileName);

    //---
    const lineReader = mdReadline.createInterface({
        input: mdFs.createReadStream(stPath)
    });

    lineReader.on('line', (stLine) => {
        console.log('line [' + stLine + ']');
    });

    /*
     fs.readFile(stPath, function (err, data) {
     if (err) {
     console.log('VRR: err [' + err + '] //190809-091100');
     return false; //TODO
     } else {

     }
     });
     */
}

//---
exports.exists = exists;
