// Include gulp
var gulp = require('gulp');

//Dep
var del = require('del');
var less = require('gulp-less-sourcemap');
var minifyCSS = require('gulp-minify-css');
var cordova = require('gulp-cordova');


var folders = {
    root : "./www/",
}
folders.assets = folders.root+"assets/";
folders.less = folders.assets+"less/";
folders.css = folders.assets+"css/";
folders.platform = folders.assets+"platform/";


var platformList = ["android","browser","ios"]; //TODO generate from folder
gulp.task('clean', function() {
  //return 
  del([folders.css+'/*.css',folders.css+'/*.css.map']);
  for (var i in platformList) {
    var p = platformList[i];
    del([folders.platform + p +'/style.css',folders.platform + p +'/style.css.map'])
  }
  //TODO clear also platform build related
});

gulp.task('less', function () {
    //TODO add .map generation
    gulp.src(folders.less + '*.less')
      .pipe(less())
      .pipe(minifyCSS())
      .pipe(gulp.dest(folders.css));
    //TODO maybe migrate to a reserved folder in platform
    for (var i in platformList) {
        var p = platformList[i];
        gulp.src(folders.platform + p +'/*.less')
              .pipe(less())
              .pipe(minifyCSS())
              .pipe(gulp.dest(folders.platform + p));
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
  gulp.watch(folders.less + '*.less', ['clean','less']);
  gulp.watch(folders.platform + '/*/*.less', ['clean','less']);
  // Watch image files
  //gulp.watch(dest + 'img/**/*', ['images']);
});

gulp.task('default', ['clean','less', 'watch']);


//TODO remove cli dependance for lessc ?
//TODO minify js
//TODO minify apk and other package delivery