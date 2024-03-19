<h1 align="center" style="font-size: 30px;">The Custom React Clone system by GULP</h1>
<div align="center">
    <a href="https://gulpjs.com">
        <img height="200" width="100" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
    </a>
    <a href="https://react.dev">
        <img height="200" width="200" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/React_Logo_SVG.svg/1200px-React_Logo_SVG.svg.png">
    </a>
</div>

## What is gulp?

- **Automation**: Gulp streamlines repetitive tasks in your development process, saving you time and effort.
- **Platform-flexible**: Compatible with major IDEs and diverse platforms like PHP, .NET, Node.js, and Java.
- **Rich Ecosystem**: Access thousands of npm modules and curated plugins for versatile file transformations.
- **User-Friendly**: Gulp's minimalistic API makes it easy to learn and straightforward to use.

## Installation

Refer to our [Quick Start guide][quick-start] for installation instructions.

## Roadmap

Explore our ongoing projects and unresolved issues on [GitHub][roadmap].

## Documentation

Visit our website for the [Getting Started guide][getting-started-guide] and [API documentation][api-docs].

**Please bear with us as we update our documentation. Report any issues you encounter!**


## Sample `gulpfile.js`

This file will give you a taste of what gulp does.

```js
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
```

## Note

- **Open Source** column means is hosting provides free tier or discounts for **Open Source** projects


## Sponsors
Become a partner of project add some your logic and improve open source code !
