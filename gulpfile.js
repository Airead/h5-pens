var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

// Static server
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch("css/**/*.css").on('change', function (evt) {
        console.log('File ' + evt.path + ' was ' + evt.type + ', running tasks...');
        gulp.src(evt.path).pipe(browserSync.stream());
    });
    gulp.watch("**/*.html").on('change', browserSync.reload);
});
