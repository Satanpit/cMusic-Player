/**
 * Build paths and options configuration
 * @type {{ Config }}
 */
module.exports = {
    root: {
        build: 'build/',
        src: 'src/'
    },

    styles: {
        src: 'src/less/main.less',
        output: {
            name: 'main.min.css',

            src: {
                dir: 'src/css',
                path: 'src/css/main.min.css'
            },
            build: {
                dir: 'build/css',
                path: 'build/css/main.min.css'
            }
        },
        watch: 'src/less/*.less'
    },

    sprite: {
        src: 'src/img/sources/sprite-assets/*.svg',
        output: {
            spritePath: 'img/sprite.svg',
            lessPath: 'less/',

            padding: 10,
            prefix: '.icon-%s'
        }
    },

    scripts: {
        src: [
            'src/components/angular/angular.js',
            'src/components/angular-animate/angular-animate.js',
            'src/components/angular-translate/angular-translate.js',
            'src/components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
            'src/components/js-md5/js/md5.js',
            'src/js/vendor/*.js',
            'src/js/services/*.js',
            'src/js/controllers/*.js',
            'src/js/directives/*.js',
            'build/js/templates.js',
            'src/js/*.js'
        ],
        output: {
            name: 'main.min.js',
            dir: 'build/js',
            path: 'build/js/main.min.js'
        }
    },

    templates: {
        cache: {
            src: 'src/templates/**/*.html',
            output: 'build/js'
        },
        index: {
            src: 'src/templates/index.html'
        }
    },

    manifest: {
        src: 'src/manifest.json'
    },

    fonts: {
        src: 'src/fonts/**/*',
        output: 'build/fonts'
    },

    images: {
        src: ['src/img/*.svg', 'src/img/*.png'],
        output: 'build/img'
    },

    background: {
        src: 'src/background.js'
    },

    server: {
        host: 'localhost',
        port: 666
    }
};