// Import Packedge
import pkg from 'gulp';
const { src, dest, watch, parallel, series, task } = pkg;

import * as nodePath from 'path';
const root_folder = nodePath.basename(nodePath.resolve());

/* Plugins */
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import replace from 'gulp-replace';
import typograf from 'gulp-typograf';
import clean from 'gulp-clean';
import newer from 'gulp-newer';
import rename from 'gulp-rename';
import changed from 'gulp-changed';
import fs from 'fs';

// Live Server
import browsersync from 'browser-sync';

/* HTML */
import fileinclude from 'gulp-file-include';
import htmlclean from 'gulp-htmlclean';

/* CSS / SCSS */
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import sourcemaps from 'gulp-sourcemaps';
import groupCssMediaQueries from 'gulp-group-css-media-queries';
import autoprefixer from 'gulp-autoprefixer';
import webpcss from 'gulp-webpcss';
import cleanCss from 'gulp-clean-css';

//Js packeges
import webpack from 'webpack-stream';
import minify from 'gulp-minify';
import webpackConfig from './webpack.config.js';
import babel from 'gulp-babel';

/* Images */
import webp from 'gulp-webp';

/* Svg */
import svgsprite from 'gulp-svg-sprite';

// Ways to folder
const path = {
  build: {
    html: `./build/`,
    css: `./build/css/`,
    js: `./build/js/`,
    images: `./build/img`,
    svg: `./build/img/svgsprite/`,
    fonts: `./build/fonts`,
    files: `./build/`,
  },
  src: {
    html: `./src/*.html`,
    scss: `./src/scss/style.scss`,
    js: `./src/js/**/*.*`,
    images: `./src/img/**/*.{jpg,jpeg,png,gif,webp}`,
    svg: `./src/img/**/*.svg`,
    fonts: `./src/fonts/**/*`,
    files: `./src/*.*`,
  },
  watch: {
    html: `./src/**/*.html`,
    js: `./src/**/*.js`,
    scss: `./src/scss/**/*.scss`,
    images: `./src/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}`,
    svgicons: `./src/img/svgicons/**/*.svg`,
    files: `./src/**/*.*`,
    fonts: `./src/fonts/**/*`,
  },
  clean: './build/',
  build_folder: './build/',
  src_folder: './src/',
  root_folder: root_folder,
};

/* Plugins for Tasks */
const plugins = {
  replace: replace,
  plumber: plumber,
  notify: notify,
  newer: newer,
  typograf: typograf,
  changed: changed,
  rename: rename,
  browsersync: browsersync,
};

/* Copy */
const copy = () => {
  return src(path.src.files)
    .pipe(changed(path.build_folder))
    .pipe(dest(path.build.files));
};

/* Clean Folder and Reset */
const reset = (done) => {
  if (fs.existsSync('./build/')) {
    return src('./build/', { read: false }).pipe(clean({ force: true }));
  }
  done();
};

/********************************************************** TASKS ***********************************************************/

/* Html Task */
const html = () => {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(plugins.changed(path.build.html, { force: true }))
    .pipe(
      plugins.plumber(
        plugins.notify.onError({
          title: 'HTML',
          message: 'Error: <%= error.message  %>',
          sounds: false,
        })
      )
    )
    .pipe(replace(/(@img\/.*?)(\.png)(?=["'\s>])/g, '$1.webp'))
    .pipe(
      plugins.typograf({
        locale: ['ru', 'en-US'],
        htmlEntity: { type: 'digit' },
        safeTags: [
          ['<\\?php', '\\?>'],
          ['<no-typography>', '</no-typography>'],
        ],
      })
    )
    .pipe(plugins.replace(/@img\//g, 'img/'))
    .pipe(htmlclean())
    .pipe(dest(path.build.html));
};

/* Scss function */
const scss = () => {
  return src(path.src.scss)
    .pipe(plugins.changed(path.build.css))
    .pipe(
      plugins.plumber(
        plugins.notify.onError({
          title: 'SCSS',
          message: 'Error: <%= error.message  %>',
          sounds: false,
        })
      )
    )
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(groupCssMediaQueries())
    .pipe(plugins.replace(/@img\//g, 'img/'))
    .pipe(
      webpcss({
        webpClass: '.webp',
        noWebpClass: '.no-webp',
      })
    )
    .pipe(
      autoprefixer({
        grid: true,
        overrideBrowserslist: ['last 3 version '],
        cascade: true,
      })
    )
    .pipe(dest(path.build.css))
    .pipe(cleanCss())
    .pipe(
      plugins.rename({
        extname: '.min.css',
      })
    )
    .pipe(sourcemaps.write())
    .pipe(dest(path.build.css))
    .pipe(plugins.browsersync.reload({ stream: true }));
};

/* Js Function */
const js = () => {
  return src(path.src.js)
    .pipe(plugins.changed(path.build.js))
    .pipe(
      plugins.plumber(
        plugins.notify.onError({
          title: 'JS',
          message: 'Error: <%= error.message  %>',
          sounds: false,
        })
      )
    )
    .pipe(
      minify({
        ext: {
          min: '.min.js',
        },
        ignoreFiles: ['-min.js'],
      })
    )
    .pipe(babel())
    .pipe(webpack(webpackConfig))
    .pipe(dest(path.build.js))
    .pipe(plugins.browsersync.reload({ stream: true }));
};

/* Images function */
const images = () => {
  return src(path.src.images)
    .pipe(
      plugins.plumber(
        plugins.notify.onError({
          title: 'IMAGES',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(plugins.changed(path.build.images))
    .pipe(plugins.newer(path.build.images))
    .pipe(webp({ quality: 85 }))
    .pipe(dest(path.build.images))
    .pipe(plugins.browsersync.reload({ stream: true }));
};

/* Svg Icons */
const svgStack = () => {
  return src(path.src.svg)
    .pipe(plugins.changed(path.build.images, { extension: '.svg' }))
    .pipe(
      plugins.plumber(
        plugins.notify.onError({
          title: 'SVG',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(
      svgsprite({
        mode: {
          stack: {
            example: true,
          },
        },
      })
    )
    .pipe(dest(path.build.svg));
};

const svgSymbol = () => {
  return src(path.src.svg)
    .pipe(plugins.changed(path.build.images, { extension: '.svg' }))
    .pipe(
      plugins.plumber(
        plugins.notify.onError({
          title: 'SVG',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(
      svgsprite({
        mode: {
          symbol: {
            sprite: '../sprite.symbol.svg',
          },
        },
        shape: {
          transform: [
            {
              svgo: {
                plugins: [
                  {
                    name: 'removeAttrs',
                    params: {
                      attrs: '(fill|stroke)',
                    },
                  },
                ],
              },
            },
          ],
        },
      })
    )
    .pipe(dest(path.build.svg));
};

/* Fonts */
function fonts() {
  return src(path.src.fonts)
    .pipe(plugins.changed(path.build.fonts))
    .pipe(dest(path.build.fonts));
}

/* Browser Live Server */
function server() {
  plugins.browsersync.init({
    server: {
      baseDir: `${path.build.html}`,
    },
    notify: true,
    port: 3000,
  });
}

/* Watch Tasks */
function watcher() {
  watch(path.watch.html, parallel(html));
  watch(path.watch.scss, parallel(scss));
  watch(path.watch.js, parallel(js));
  watch(path.watch.images, parallel(images));
  watch(path.watch.fonts, parallel(fonts));
  watch(path.watch.files, parallel(copy));
}

/* Concat tasks in one time */
const main_tasks = parallel(
  html,
  scss,
  js,
  images,
  fonts,
  parallel(svgStack, svgSymbol),
  copy
);

/* Looking implemention of tasks */
const dev = series(reset, main_tasks, parallel(watcher, server));

/* Implement Tasks in NPM  */
task('default', dev);
