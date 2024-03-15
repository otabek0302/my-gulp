// Import Packedge
import gulp from 'gulp';
import * as path from 'path';
const { src, dest, watch, parallel, series, task } = gulp;

import * as nodePath from 'path';
const root_folder = path.basename(path.resolve());

/* HTML */
import fileInclude from 'gulp-file-include';

// Ways to folder
const build_folder = './build';
const src_folder = './src';

const paths = {
  build: {
    html: `${build_folder}/`,
  },
  src: {
    html: [`${src_folder}/**/*.html`, `!./**/components/**/*.*`],
  },
  watch: {
    html: `${src_folder}/**/*.html`,
  },
  clean: build_folder,
  build_folder: build_folder,
  src_folder: src_folder,
  root_folder: root_folder,
};

/* TASK FOR HTML */
const html = () => {
  return src(paths.src.html).pipe(fileInclude()).pipe(dest(paths.build.html));
};

/* WATCHING ALL TASKS */
const watcher = () => {
  watch(paths.watch.html, html);
};

/* START TASKS */
const main_tasks = parallel(html);

/* LOOKING IMPLEMENTATION OF TASKS */
const dev = series(main_tasks, watcher);

/* IMPLEMENT TASKS */
task('default', dev);
