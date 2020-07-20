//HTML
import htmlmin from 'gulp-htmlmin';

//CSS
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';

//JavaScript
import gulp from 'gulp';
import babel from 'gulp-babel';
import terser from 'gulp-terser';

//PUG
import pug from 'gulp-pug';

//SASS
import sass from 'gulp-sass';

//Common
import concat from 'gulp-concat';

//Clean CSS
import clean from 'gulp-purgecss';

//Clean CSS
import del from 'del';

//Caché bust
import cacheBust from 'gulp-cache-bust';

//Optimización imágenes
import imagemin from 'gulp-imagemin';

//Browser sync
import { init as server, stream, reload } from 'browser-sync';

//Plumber
import plumber from 'gulp-plumber';

//Typescript
// import ts from 'gulp-typescript';

const production = false;

//Variables/constantes
const cssPlugins = [cssnano(), autoprefixer()];

// Paths
const paths = {
   root: {
      www: 'public',
   },
   src: {
      root:    'src',
      pug:     'src/pug/index.pug',
      html:    'src/html/**/*.html',
      css:     'src/css/*.css',
      scss:    'src/scss/**/*.scss',
      js:      'src/js/**/*.js',
      vendors: 'src/assets/vendors/**/*.*',
      imgs:    'src/assets/img/**/*.+(png|jpg|gif|svg)',
   },
   dist: {
      root:    'public',
      php:     'public/php',
      pug:     'public',
      html:    'public',
      css:     'public/css',
      js:      'public/js',
      imgs:    'public/assets/img',
      vendors: 'public/assets/vendors',
   },
};

gulp.task('htmlTask', () => {
   return gulp
      .src(paths.src.html)
      .pipe(plumber())
      .pipe(
         htmlmin({
            collapseWhitespace: true,
            removeComments: true
         })
      )
      .pipe(gulp.dest(paths.dist.html));
});

gulp.task('cssTask', () => {
   return gulp
      .src(paths.src.css)
      .pipe(plumber())
      .pipe(concat('styles.css'))
      .pipe(postcss(cssPlugins))
      .pipe(gulp.dest(paths.dist.css))
      .pipe(stream());
});

gulp.task('jsTask', () => {
  return gulp
    .src(paths.src.js)
    .pipe(plumber())
   //  .pipe(concat('app.js'))
    .pipe(babel({presets: ['@babel/preset-env'],}))
    .pipe(terser())
    .pipe(gulp.dest(paths.dist.js));
});

gulp.task('pugTask', () => {
   return gulp
      .src('paths.src.pug')
      .pipe(plumber())
      .pipe(
         pug({
            pretty: production ? false : true
         })
      )
      .pipe(
         cacheBust({
            type: 'timestamp'
         })
      )
      .pipe(gulp.dest(paths.dist.pug));
});

gulp.task('sassTask', () => {
   return gulp
      .src(paths.src.scss)
      .pipe(plumber())
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError),)
      .pipe(postcss(cssPlugins))
      .pipe(gulp.dest(paths.src.root + '/css'))
      .pipe(stream());
});

gulp.task('cleanTask', () => {
  return gulp
    .src('./public/css/styles.css')
    .pipe(plumber())
    .pipe(
      clean({
        content: ['./public/*.html']
      })
    )
    .pipe(gulp.dest('./public/css'));
});

gulp.task('imgTask', () => {
  return gulp
    .src(paths.src.imgs)
    .pipe(plumber())
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 30, progressive: true }),
        imagemin.optipng({ optimizationLevel: 1 })
      ])
    )
    .pipe(gulp.dest(paths.dist.imgs));
});

// gulp.task('typescript', () => {
//   return gulp
//     .src('src/ts/*.ts')
//     .pipe(
//       ts({
//         noImplicitAny: true,
//         outFile: 'using-ts.js'
//       })
//     )
//     .pipe(gulp.dest('public/js'));
// });

// delTask 
gulp.task('delTask', ()=> {
   del(paths.src.css);
	return del(paths.dist.root);
});


gulp.task('start', gulp.series('delTask', 'htmlTask', 'imgTask', 'sassTask', 'cssTask','jsTask'));


gulp.task('default', () => {
  server({
    server: {baseDir: paths.root.www}
  });
	gulp.watch(paths.src.html, gulp.series('htmlTask'));
	gulp.watch(paths.src.imgs, gulp.series('imgTask'));
   gulp.watch(paths.src.scss, gulp.series('sassTask','cssTask'));
	gulp.watch(paths.src.js, gulp.series('jsTask'));
	gulp.watch(paths.dist.html).on('change', reload);
});