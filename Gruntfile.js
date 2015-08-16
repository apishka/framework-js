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
            JihadJs: 'compile'
        },

        copy: {
            JihadJs: {
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
            JihadJs: {
                files: {
                    'dist/js/jihad-js.js': [
                        'source/jihad.js',
                        'source/modules/*.js',
                        'source/blocks/*/*.js',
                    ]
                }
            }
        },

        uglify: {
            JihadJs: {
                files: {
                    'dist/js/jihad-js.js': [
                        'dist/js/jihad-js.js'
                    ]
                }
            }
        },

        less: {
            JihadJs: {
                files: {
                    'dist/css/jihad-js.css': markupMain('jihad.less')
                }
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 8', 'ie 9', 'android 2.3', 'android 4', 'opera 12']
            },
            JihadJs: {
                src: 'dist/css/jihad-js.css'
            }
        },

        cssmin: {
            JihadJs: {
                files: {
                    'dist/css/jihad-js.css': [
                        'dist/css/jihad-js.css'
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
