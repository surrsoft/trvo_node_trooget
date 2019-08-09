/*
Функции связанные в целом с Node JS
 */

//---
const path = require('path');

//---

/*
 Возвращает абсолютный путь к корню проекта.
 Например: D:\barannikov\_Misc\Dropbox\_Web\_Projects\node_trvo
 */
function pathRootGet() {
    return path.dirname(require.main.filename);
}

/*
 Преобразует относительный путь (1) в абсолютный

 @param stPathRelative () -- путь относительный, относительно текущего проекта, например "../f/b"
 @return например "D:\x\f\b"
 */
function pathAbsByRelative(stPathRelative) {
    var stPathRoot = pathRootGet();
    return path.resolve(stPathRoot, stPathRelative);
}

exports.pathRootGet = pathRootGet;
exports.pathAbsByRelative = pathAbsByRelative;