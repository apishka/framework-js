module.exports = function (grunt) {
    var MARKUP_MAIN = 'source';

    function markupMain(path) {
        return [MARKUP_MAIN, path || ''].join('/');
    }

    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            ApishkaJs: 'compile'
        },

        copy: {
            ApishkaJs: {
                expand: true,
                flatten: true,
                cwd: markupMain(),
                src: [
                    'blocks/**/*.{png,gif,jpg,jpeg}'
                ],
                dest: 'dist/images/'
            },
            fonts: {
                expand: true,
                flatten: true,
                src: [
                    'node_modules/font-awesome/fonts/*',
                    markupMain('blocks/**/fonts/*')
                ],
                dest: 'dist/fonts/'
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            ApishkaJs: {
                files: {
                    'dist/js/apishka-js.js': [
                        // Help libraries
                        'node_modules/autosize/dist/autosize.js',
                        'node_modules/dot/doT.js',
                        'node_modules/js-cookie/src/js.cookie.js',
                        'node_modules/form-serializer/jquery.serialize-object.js',
                        'node_modules/sticky-kit/dist/sticky-kit.js',
                        'source/library/jquery.hotkeys.js',
                        'source/library/jquery.ajaxQueue.js',

                        'source/apishka.js',
                        'source/modules/*.js',
                        'source/blocks/*/*.js',
                    ]
                }
            }
        },

        uglify: {
            ApishkaJs: {
                files: {
                    'dist/js/apishka-js.js': [
                        'dist/js/apishka-js.js'
                    ]
                }
            }
        },

        less: {
            ApishkaJs: {
                files: {
                    'dist/css/apishka-js.css': markupMain('apishka.less')
                }
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 8', 'ie 9', 'android 2.3', 'android 4', 'opera 12']
            },
            ApishkaJs: {
                src: 'dist/css/apishka-js.css'
            }
        },

        cssmin: {
            ApishkaJs: {
                files: {
                    'dist/css/apishka-js.css': [
                        'dist/css/apishka-js.css'
                    ]
                }
            }
        }
    });

    grunt.registerTask('css',           ['less', 'autoprefixer']);
    grunt.registerTask('js',            ['concat']);
    grunt.registerTask('minify',        ['uglify', 'cssmin']);

    // Default task(s).
    grunt.registerTask('default',       ['clean', 'copy', 'css', 'js', 'minify']);
    grunt.registerTask('dev',           ['clean', 'copy', 'css', 'js']);
};
