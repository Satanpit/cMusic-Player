var path = require("path"),
    gulp = require("gulp"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    less = require("gulp-less"),
    svgSprite = require("gulp-svg-sprite"),
    uglify = require("gulp-uglify"),
    inject = require("gulp-inject"),
    sourceMaps = require("gulp-sourcemaps"),
    livereload = require("gulp-livereload"),
    zip = require("gulp-zip"),
    templateCache = require('gulp-angular-templatecache'),
    jsonEditor = require("gulp-json-editor");

var config = require("./build-config");

gulp.task('build:index', function() {
    var sources = gulp.src(config.scripts.src.concat([ config.styles.output.src.path ]), { read:false });

    return gulp.src(config.templates.index.src)
        .pipe(inject(sources, {
            transform: transformInjectsSrc
        }))
        .pipe(gulp.dest( config.root.src ))
        .pipe(livereload())
});

gulp.task('build:sprite', function() {
    return gulp.src(config.sprite.src)
        .pipe(svgSprite({
            shape: {
                spacing: { padding: config.sprite.output.padding }
            },
            mode: {
                css: {
                    render: { less: true },
                    bust: false,
                    prefix: config.sprite.output.prefix,
                    sprite: path.join(__dirname, config.sprite.output.spritePath),
                    dest: path.join(__dirname, config.sprite.output.lessPath)
                }
            }
        }))
        .pipe(gulp.dest( config.root.src ))
});

gulp.task('build:styles', function() {
    return gulp.src(config.styles.src)
        .pipe(less())
        .pipe(concat(config.styles.output.name))
        .pipe(cssmin())
        .pipe(gulp.dest(config.styles.output.src.dir))
        .pipe(livereload())
});

gulp.task('build:scripts', ['build:templates'], function() {
    return gulp.src(config.scripts.src)
        .pipe(sourceMaps.init())
        .pipe(concat(config.scripts.output.name))
        .pipe(uglify({mangle: false}))
        .pipe(sourceMaps.write('/'))
        .pipe(gulp.dest(config.scripts.output.dir))
});

gulp.task('build:templates', function() {
    return gulp.src(config.templates.cache.src)
        .pipe(templateCache())
        .pipe(gulp.dest(config.templates.cache.output))
});

gulp.task('build:manifest', function() {
    return gulp.src(config.manifest.src)
        .pipe(jsonEditor(function(json) {
            json['app']['background']['scripts'] = ["background.js"];
            return json;
        }, { 'indent_char': ' ', 'indent_size': 2 }))
        .pipe(gulp.dest( config.root.build ))
});


gulp.task('copy:styles', function() {
    return gulp.src(config.styles.output.src.path).pipe(gulp.dest(config.styles.output.build.dir));
});

gulp.task('copy:fonts', function() {
    return gulp.src(config.fonts.src).pipe(gulp.dest(config.fonts.output));
});

gulp.task('copy:images', function() {
    return gulp.src(config.images.src).pipe(gulp.dest(config.images.output));
});

gulp.task('copy:background', function() {
    return gulp.src(config.background.src).pipe(gulp.dest(config.root.build));
});

gulp.task('copy:index', function() {
    var sources = gulp.src([ config.styles.output.build.path, config.scripts.output.path ], { read:false });

    return gulp.src(config.templates.index.src)
        .pipe(inject(sources, {
            transform: transformInjectsSrc
        }))
        .pipe(gulp.dest( config.root.build ))
});

gulp.task('copy', ['copy:styles', 'copy:fonts', 'copy:images', 'copy:background', 'copy:index']);

gulp.task('build', ['build:sprite', 'build:styles', 'build:scripts', 'build:index', 'build:manifest']);

gulp.task('watcher', ['build:sprite', 'build:styles', 'build:index'], function() {
    livereload.listen(config.server);

    gulp.watch(config.styles.watch, ['build:styles']);
    gulp.watch(config.sprite.src, ['build:sprite']);
    gulp.watch(config.templates.index.src, ['build:index'])
});


function transformInjectsSrc() {
    var args = arguments;
    args[0] = args[0].replace(/\/build\/|\/src\//, '');
    return inject.transform.apply(inject.transform, args);
}