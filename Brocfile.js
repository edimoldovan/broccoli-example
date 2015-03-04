var filterTemplates = require('broccoli-template');
var uglifyJavaScript = require('broccoli-uglify-js');
var compileES6 = require('broccoli-es6-concatenator');
var compileSass = require('broccoli-sass');
var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');
var findBowerTrees = require('broccoli-bower');
var env = require('broccoli-env').getEnv();
var fs = require("fs");
var pickFiles = require('broccoli-static-compiler')

var app = pickFiles('app', {
  srcDir: '/',
  destDir: 'assets'
});

var styles = 'styles';
styles = pickFiles(styles, {
	srcDir: '/',
	destDir: 'broccoli'
});

var vendor = 'vendor';

var sourceTrees = [app, styles, vendor];

sourceTrees = sourceTrees.concat(findBowerTrees());

var appAndDependencies = new mergeTrees(sourceTrees, { overwrite: true });

var appJs = appAndDependencies;

var appCss = compileSass(sourceTrees, 'broccoli/app.scss', 'assets/app.css');

// if (env === 'development') {
if (env === 'production') {
  // minify js
  appJs = uglifyJavaScript(appJs, {
    mangle: false,
    compress: false
  })
};

var publicFiles = 'public';

var merge = mergeTrees([appJs, appCss, publicFiles]);

module.exports = merge;

