var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    cache = require('gulp-cache'),
    cssnano = require('gulp-cssnano'),
    del = require('del'),
    gulpIf = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    runSequence = require('run-sequence'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    useref = require('gulp-useref');

// Development Tasks
// -----------------

// Start browserSync server
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ['src']
        }
    })
});

// Copy vemdor js to src
gulp.task('vendorjs', function() {
    return gulp.src([
            'node_modules/jquery/dist/jquery.js',
            'node_modules/popper.js/dist/umd/popper.js',
            'node_modules/bootstrap/dist/js/bootstrap.js',
            'node_modules/exlink/jquery.exlink.js',
            'node_modules/svgxuse/svgxuse.js'
        ])
        .pipe(gulp.dest('src/template/js'))
});

// Copy js to dist
gulp.task('scripts', function() {
    return gulp.src([
            'src/template/js/**/*.js'
        ])
        .pipe(gulp.dest('dist/template/js'))
});

// Copy css to dist
gulp.task('css', function() {
    return gulp.src([
            'src/template/css/**/*.css'
        ])
        // .pipe(gulp.dest('dist/Data/sites/1/skins/MetroTransitIII'))
        .pipe(gulp.dest('dist/template/css'))
});

// Copy sourcemaps to dist
// gulp.task('sourcemaps', function() {
//     return gulp.src('src/maps/**/*.map')
//         .pipe(gulp.dest('dist/maps'))
// });

// Copy fonts to dist
gulp.task('fonts', function() {
    return gulp.src('src/template/fonts/*')
        .pipe(gulp.dest('dist/template/fonts'))
});

// Compile sass to css
gulp.task('sass', function() {
    return gulp.src('src/template/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('maps'))
        // .pipe(gulp.dest('src/Data/sites/1/skins/MetroTransitIII'))
        .pipe(gulp.dest('src/template/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});


// Watchers
gulp.task('watch', function() {
    gulp.watch('src/template/scss/**/*.scss', ['sass']);
    // gulp.watch('src/Data/sites/1/skins/MetroTransitIII/*.html', browserSync.reload);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/template/js/**/*.js', browserSync.reload);
});

// Optimization Tasks
// ------------------

// Optimize CSS and JS
gulp.task('useref', function() {
    return gulp.src([
            // 'src/Data/sites/1/skins/MetroTransitIII/*.html',
			'src/*.html',
			'!src/_primary-boilerplate.html',
			'!src/_secondary-boilerplate.html'
        ]) // Grabs CSS and JS from HTML document
        .pipe(useref())
        .pipe(gulpIf('template/js/*.js', uglify())) // Minifies only if it's a js file
        .pipe(gulpIf('template/css/*.css', cssnano())) // Minifies only if it's a css file
        // .pipe(gulp.dest('dist/Data/sites/1/skins/MetroTransitIII'))
        .pipe(gulp.dest('dist'))
});

// Optimize images
gulp.task('images', function() {
    return gulp.src('src/template/img/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin({
            interlaced: true
        })) // refer to https://github.com/sindresorhus/gulp-imagemin for optimization options available based on file type.
        .pipe(gulp.dest('dist/template/img'))
});

// Clean Dist
gulp.task('clean', function() {
    return del.sync('dist').then(function(cb) {
        return cache.clearAll(cb);
    });
})

gulp.task('clean:dist', function() {
    return del.sync('dist/**/*');
});

// Build Sequence
// --------------
gulp.task('default', function(callback) {
    runSequence(['vendorjs', 'sass', 'browserSync'], 'watch',
        callback
    )
});

gulp.task('build', function(callback) {
    runSequence(
        'clean:dist',
        'sass', ['useref', 'css', 'fonts', 'scripts', 'images'],
        callback
    )
});
