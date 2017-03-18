var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');

//post css
var postcss = require('gulp-postcss');
var precss = require('precss');
var cssnext = require('postcss-cssnext');
var cssimport = require('postcss-import');
var customMedia = require('postcss-custom-media');
var minmax = require('postcss-media-minmax');
var cssnesting = require('postcss-nesting');
var simpleExtend = require('postcss-extend');
var webpack = require('webpack-stream');
var shell = require('gulp-shell');
var rename = require('gulp-rename');
var named = require('vinyl-named');
var gutil = require('gulp-util');
var cssnano = require('gulp-cssnano');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');

// karma/jasmine/phantomjs
var karmaServer = require('karma').Server;

gulp.task('unit-test', function(done){
    new karmaServer({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});


/***********************************************/

gulp.task('css', function () {
    var processors = [
        cssimport(),
        cssnext({
            'browsers': ['last 2 version', '> 5%'], /* ' > 5%' - versions selected by global usage statistics. ( https://github.com/ai/browserslist#queries ) */
            'customProperties': true,
            'colorFunction': true,
            'customSelectors': true,
            'sourcemap': true,
            'nesting': true,
            'compress': true
        }),
        cssimport,
        customMedia,
        minmax,
        cssnesting,
        simpleExtend,
        precss
    ];

    return gulp.src('./mediaCarousel.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./dist'));
});

gulp.task('js', function() {
    return gulp.src('./mediaCarousel.js')
        .pipe(named())
        .pipe(webpack( require('./webpack.config.js') ))
        .pipe(gulp.dest('.'))

});

/* When calling gulp dev, call less + css and js */
gulp.task('dev', ['css','js']);

gulp.task('dev-watch', function() {
    /* If someone is making tweaks to legacy less files, kick off the less process again */
    gulp.watch('./mediaCarousel.css', ['css']);

    /* If our JS entry file is including a new component, rebuild the JS */
    gulp.watch(['./mediaCarousel','./scrollEvent.js'], ['js']);

});

