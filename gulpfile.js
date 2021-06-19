var gulp = require('gulp')
var sftp = require('gulp-sftp')
var debug = require('gulp-debug')


gulp.task('test', function() {
    return gulp.src('./dist/index.html')
        .pipe(debug())
        .pipe(sftp({
            host: '47.96.66.5',
            port: '22',
            user: 'root',
            pass: 'hn@123456',
            remotePath: '/data/wwwroot/apps/api/web/public/static'
        }));
});