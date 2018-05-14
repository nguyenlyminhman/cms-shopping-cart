const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

gulp.task('default', () => {
    nodemon({
        script: 'app.js',
        ext: 'js',
        ignore: './node_modules/**'
    }).on('restart', ()=>{
        console.log('Server is restarting...')
    })
})