/* globals require */

// Include gulp
var gulp = require('gulp');

//Dep
var del = require('del');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var cordova = require('gulp-cordova');
var minify = require('gulp-minify');


//Less Plugins
var LessPluginCleanCSS = require('less-plugin-clean-css'),
    LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    cleancss = new LessPluginCleanCSS({ advanced: true }),
    autoprefix = new LessPluginAutoPrefix({browsers: ['> 0.01%', 'last 3 versions', 'Android > 18', 'last 5 ChromeAndroid versions', 'iOS > 3']});

var folders = {
    root : "./www/"
};

folders.assets = folders.root + "assets/";
folders.dist = folders.root + "dist/";

folders.less = folders.assets + "less/";
folders.css = folders.assets + "css/";
folders.js = folders.assets + "js/";
folders.platform = folders.assets + "platform/";


var platformList = ["android", "browser", "ios"]; //TODO generate from folder
var langList = ["en", "fr"]; //TODO generate from folder

function jsFolder(){
  var f =  [folders.js, folders.js + '/page', folders.js + '/nls'];
  for (var l in langList) {
    if (langList.hasOwnProperty(l)) {
        f.push(folders.js + '/nls/' + langList[l]);
    }
  }
  for (var p in platformList) {
    if (platformList.hasOwnProperty(p)) {
        f.push(folders.platform + platformList[p]);
    }
  }
  return f;
}
gulp.task('clean-js', function () {
  var folder = jsFolder();
  for (var i in folder) {
    if (folder.hasOwnProperty(i)) {
        folder[i] = folder[i].replace(folders.assets, folders.dist);
    }
  }
  return del(folder);
});
gulp.task('clean-css', function () {
  return del([folders.assets + "/**/*.css",folders.dist + "/css/*.css",folders.dist + "/platform/**/*.css",folders.assets + "/**/*.map",folders.dist + "/css/maps/*.map",folders.dist + "/platform/**/*.map"]);
});

gulp.task('beautify', [], function() {
  var folder = jsFolder();
  for (var i in folder) {
    if (folder.hasOwnProperty(i)) {
        gulp.src([folder[i] + '/*.js', '!'+folder[i]+'/*.min.js'])
          .pipe(minify({
            ext:{
                src:'.js',
                min:'.js'
            },
            mangle : false,
            compress: false,
            output : {
              indent_start  : 0,     // start indentation on every line (only when `beautify`)
              indent_level  : 4,     // indentation level (only when `beautify`)
              quote_keys    : false, // quote all keys in object literals?
              space_colon   : true,  // add a space after colon signs?
              ascii_only    : false, // output ASCII-safe? (encodes Unicode characters as ASCII)
              inline_script : false, // escape "</script"?
              width         : 80,    // informative maximum line width (for beautified output)
              max_line_len  : 32000, // maximum line length (for non-beautified output)
              ie_proof      : true,  // output IE-safe code?
              beautify      : true, // beautify output?
              source_map    : null,  // output a source map
              bracketize    : true, // use brackets every time?
              comments      : true, // output comments?
              semicolons    : true,  // use semicolons to separate statements? (otherwise, newlines)
            },
            noSource : true
        }))
        .pipe(gulp.dest(folder[i]));
    }
  }
});

gulp.task('compress', ['clean-js'], function() {
  var folder = jsFolder();
  for (var i in folder) {
    if (folder.hasOwnProperty(i)) {
        gulp.src([folder[i] + '/*.js', '!'+folder[i]+'/*.min.js'])
          .pipe(minify({
            ext:{
                src:'.js',
                min:'.js'
            },
            noSource : true
        }))
        .pipe(gulp.dest(folder[i].replace(folders.assets, folders.dist)));
    }
  }
});

gulp.task('less', ['clean-css'], function () {

    gulp.src(folders.less + '*.less')
      .pipe(sourcemaps.init())
      .pipe(less({ plugins: [autoprefix,cleancss] }))
      .pipe(sourcemaps.write("./maps"))
      .pipe(gulp.dest(folders.css.replace(folders.assets, folders.dist)));

    for (var i in platformList) {
        if(platformList.hasOwnProperty(i)){
                var p = platformList[i];
                gulp.src(folders.platform + p +'/less/*.less')
                      .pipe(sourcemaps.init())
                      .pipe(less({ plugins: [autoprefix,cleancss] }))
                      .pipe(sourcemaps.write("./maps"))
                      .pipe(gulp.dest(folders.platform.replace(folders.assets, folders.dist) + p + '/css/'));
                      /*
                      .pipe(gulp.dest(folders.platform + p + '/css/'))
                      .pipe(minifyCss())
                      .pipe(rename({ extname: '.min.css' }))
                      */
        }
    }

});

gulp.task('cordova:init', function() {
  gulp.src('./package.json')
    .pipe(cordova());
});

gulp.task('cordova:build',['less','compress'], function() {
  //gulp.pipe(
    cordova(['build']);
    //)
  //TODO add specific platform build
});
// Watch for changes in files
gulp.task('watch', function() {
  // Watch .js files
  //gulp.watch(src + 'js/*.js', ['scripts']);
  // Watch .less files
  //gulp.watch(folders.less + '*.less', ['clean','less']);
  //gulp.watch(folders.platform + '/*/*.less', ['clean','less']);
  gulp.watch([folders.assets + '**/*.less',folders.assets + '**/*.js'], ['clean','less','compress']);

  // Watch image files
  //gulp.watch(dest + 'img/**/*', ['images']);
});
gulp.task('clean', ['clean-js','clean-css']);
gulp.task('build', ['cordova:build']);
gulp.task('default', ['less','compress']);


//TODO minify js & html
//TODO minify apk and other package delivery
