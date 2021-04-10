const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const pipe = require('gulp-pipe');

gulp.task('default',()=>{
  console.log('gulp is listening');

});

function handleChange(){
  return pipe([
    gulp.src('./src/**/*.js'),
    babel({
      presets: ['@babel/preset-env'],// ES6 -> ES5
    }),
    uglify(), //压缩
    concat('baseModel.js'), // 合并
    gulp.dest('./dist'), // 输出
  ]);
}


gulp.watch('./src/**/*.js',handleChange)