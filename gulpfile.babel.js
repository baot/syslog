import gulp from 'gulp';
import run from 'run-sequence';
import rimraf from 'rimraf';
import shell from 'gulp-shell';
import eslint from 'gulp-eslint';

const paths = {
  js: ['./src/**/*.js'],
  build: './app'
};

gulp.task('build', cb => {
  run('clean', 'lint', 'babel', cb);
});

// rm -rf build folder
gulp.task('clean', cb => {
  rimraf(paths.build, cb);
});

// transpile
gulp.task('babel', shell.task([
  'babel src --out-dir app'
]));

// linting
gulp.task('lint', cb => {
  return gulp.src(['src/**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('babel-node', shell.task([
  'babel-node --debug src/app.js -s 3000 -r 3001'
]));

// dev task
gulp.task('dev', cb => {
  run('lint', 'babel-node', cb);
});
