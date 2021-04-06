const _ = require("fxjs/Strict");
const C = require("fxjs/Concurrency");
const uglify = require("uglify-js");
const sass = require("node-sass");
const fs = require("fs");

const uglifyOptions = { warnings: true, mangle: { toplevel: true } };
const sassOptions = { outputStyle: 'compressed' }

const checkFolder = (folderPath) => fs.existsSync(folderPath);
const makeFolder = (path) => fs.mkdirSync(path);
const uglifyJs = (file) => _.go(
  file,
  fileInfo => {
    const { error, code } = uglify.minify(fileInfo.body, uglifyOptions);
    fileInfo.body = code;
    fileInfo.error = error;
    return fileInfo
  },
  _.ifElse(
    fileInfo => !fileInfo.error,
    _.identity,
    fileInfo => (fileInfo.body = '', fileInfo)
  ),
);

const writeFile = (code, path) => fs.writeFileSync(path, code);
const readFile = (fileName, path) => ({ fileName, body: fs.readFileSync(path, "utf-8") });
const sassRedner = (fileName, path) => {
  try{
    const { css } = sass.renderSync({ file: path, ...sassOptions });
    return { fileName, body: css.toString() }
  }catch(e){
    return { fileName, body: '' }
  }
}

const writeMinifiedFile = (origin, dist, { css = [], js = [] }) => (asset) => {
  const jsReg = new RegExp(/\.js$/);
  const cssReg = new RegExp(/\.scss$/);
  _.go(
    `${dist}/${asset.dir}`,
    _.ifElse(
      checkFolder,
      _.identity,
      makeFolder
    )
  );

  _.goS(
    asset,
    _.stopIf(({ dir }) => js.includes(dir)),
    asset => asset.files,
    _.filter(file => jsReg.test(file)),
    C.map(fileName => readFile(fileName, `${origin}/${asset.dir}/${fileName}`)),
    C.map(uglifyJs),
    C.map(({ fileName, body }) => writeFile(body, `${dist}/${asset.dir}/${fileName}`))
  );

  _.goS(
    asset,
    _.stopIf(({ dir }) => css.includes(dir)),
    asset => asset.files,
    _.filter(file => cssReg.test(file)),
    C.map(fileName => sassRedner(fileName, `${origin}/${asset.dir}/${fileName}`)),
    C.map(({ fileName, body }) => writeFile(body, `${dist}/${asset.dir}/${fileName.split(".")[0]}.css`))
  );
}

const minifyFiles = ({originPrefix, distPrefix, ignoreFile = { css:[] , js: []}}) => {
  _.go(
    fs.readdirSync(originPrefix),
    C.map(dir => ({ dir: dir, files: fs.readdirSync("./assets/" + dir)})),
    C.map(writeMinifiedFile(originPrefix, distPrefix, ignoreFile))
  );
}

module.exports = minifyFiles;