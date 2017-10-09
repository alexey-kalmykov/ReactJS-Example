var gulp = require('gulp');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var exec = require('child_process').exec;

gulp.task('lite-server', function (cb) {
  exec('npm start', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('copy-index', function () {
    gulp.src('src/index.html')
        .pipe(gulp.dest('build'));
});

gulp.task('copy-react', function () {
    gulp.src([
      'node_modules/react/dist/react.min.js',
      'node_modules/react-dom/dist/react-dom.min.js',
      'node_modules/react-router/umd/react-router.min.js',
      'node_modules/react-router-dom/umd/react-router-dom.min.js',
      'node_modules/react-bootstrap/dist/react-bootstrap.min.js'
    ])
        .pipe(gulp.dest('build'));
});

gulp.task('babel', function () {
  return gulp.src('src/app.js')
    .pipe(babel())
    .pipe(gulp.dest('build'));
});

gulp.task('sass', function () {
  return gulp.src('src/style.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build'));
});

gulp.task('bootstrap', function () {
    gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
      .pipe(gulp.dest('build'));
});
gulp.task('css', ['sass','bootstrap']);
gulp.task('js', ['copy-react','babel']);
gulp.task('default', ['copy-index','css','js','lite-server']);
