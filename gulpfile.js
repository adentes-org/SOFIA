'use strict';
// Include gulp
var gulp = require('gulp');

//Dep
var del = require('del');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var cordova = require('gulp-cordova');

//Less Plugins
var LessPluginCleanCSS = require('less-plugin-clean-css'),
    LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    /* cleancss = new LessPluginCleanCSS({ advanced: true }), */
    autoprefix = new LessPluginAutoPrefix({browsers: ['> 0.01%', 'last 3 versions', 'Android > 18', 'last 5 ChromeAndroid versions', 'iOS > 3']});
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var rename = require("gulp-rename");

var folders = {
    root : "./www/"
};

folders.assets = folders.root + "assets/";
folders.less = folders.assets + "less/";
folders.css = folders.assets + "css/";
folders.platform = folders.assets + "platform/";


var platformList = ["android", "browser", "ios"]; //TODO generate from folder
gulp.task('clean', function () {
  //return 
    del([folders.css + '/*.css', folders.css + '/maps/*.css.map']);
    for (var i in platformList) {
        if(platformList.hasOwnProperty(i)){
        	var p = platformList[i];
        	del([folders.platform + p +'/css/*.css',folders.platform + p +'/css/maps/*.css.map'])
    	}
}
  //TODO clear also platform build related
});

gulp.task('less', function () {

    gulp.src(folders.less + '*.less')
      .pipe(sourcemaps.init())
      .pipe(less({ plugins: [autoprefix] }))
      .pipe(gulp.dest(folders.css))
      .pipe(minifyCss())
      .pipe(rename({ extname: '.min.css' }))
      .pipe(sourcemaps.write("./maps"))
      .pipe(gulp.dest(folders.css));

      //TODO maybe migrate to a reserved folder in platform
    
    for (var i in platformList) {
        if(platformList.hasOwnProperty(i)){
                var p = platformList[i];
                gulp.src(folders.platform + p +'/css/*.less')
                      .pipe(sourcemaps.init())
                      .pipe(less({ plugins: [autoprefix] }))
                      .pipe(gulp.dest(folders.platform + p + '/css/'))
                      .pipe(minifyCss())
                      .pipe(rename({ extname: '.min.css' }))
                      .pipe(sourcemaps.write("./maps"))
                      .pipe(gulp.dest(folders.platform + p + '/css/'));  
        }
    }
    
});

gulp.task('cordova:init', function() {
  gulp.src('./package.json')
    .pipe(cordova())
})

gulp.task('cordova:build', function() {
  //gulp.pipe(
    cordova(['build'])
    //)
  //TODO add specific platform build
})
// Watch for changes in files
gulp.task('watch', function() {
  // Watch .js files
  //gulp.watch(src + 'js/*.js', ['scripts']);
  // Watch .less files
  //gulp.watch(folders.less + '*.less', ['clean','less']);
  //gulp.watch(folders.platform + '/*/*.less', ['clean','less']);
  gulp.watch(folders.assets + '**/*.less', ['clean','less']);
  // Watch image files
  //gulp.watch(dest + 'img/**/*', ['images']);
});

gulp.task('build', ['clean','less', 'cordova:build']);
gulp.task('default', ['clean','less', 'watch']);


//TODO remove cli dependance for lessc ?
//TODO minify js
//TODO minify apk and other package delivery
