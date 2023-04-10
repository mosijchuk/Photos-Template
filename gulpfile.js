let preprocessor = "scss";
let fileswatch = "html";
const { src, dest, parallel, series, watch, lastRun } = require("gulp");
const scss = require("gulp-sass")(require("sass"));
const cleancss = require("gulp-clean-css");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify-es").default;
const autoprefixer = require("gulp-autoprefixer");

// Local Server
const browsersync = () => {
  browserSync.init({
    server: { baseDir: "docs" },
    notify: false,
  });
};

// CSS
let mainStyles = () => {
  return src("docs/" + preprocessor + `/*`)
    .pipe(scss())
    .pipe(concat(`main.min.css`))
    .pipe(
      autoprefixer({ overrideBrowserslist: ["last 10 versions"], grid: true })
    )
    .pipe(cleancss({ level: { 1: { specialComments: 0 } } }))
    .pipe(dest("docs/css"))
    .pipe(browserSync.stream());
};

// JS
const scripts = () => {
  return src([
    "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
    "./docs/js/main.js",
  ])
    .pipe(concat(`main.min.js`))
    .pipe(uglify()) // Minify JS (opt.)
    .pipe(dest("docs/js"))
    .pipe(browserSync.stream());
};

// Watching
const startwatch = () => {
  watch("docs/" + preprocessor + "/*", mainStyles);
  watch(["docs/js/*.js", "!docs/js/*.min.js"], scripts);
  watch(["docs/index.html"]).on("change", browserSync.reload);
};

exports.browsersync = browsersync;
exports.assets = series(mainStyles, scripts);
exports.mainStyles = mainStyles;
exports.scripts = scripts;
exports.default = parallel(mainStyles, scripts, browsersync, startwatch);
