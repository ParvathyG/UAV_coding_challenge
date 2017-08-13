/**
 * gruntfile.js 2017-07-06
 * 
 *
 * Version  : 1.0.0 
 * CopyRight: ACTIOTECH
 **/

module.exports = function(grunt) {

    'use strict';
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Configurable paths for the application
    var appConfig = {
        app: 'src',
        dist: 'dist'
    };

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        appconfig: appConfig,

        /**
         * ---------------------------- CLEAN ----------------------------
         *
         **/
        clean: ['dist'],

        /**
         * ---------------------------- CONCAT ----------------------------
         *
         **/
        concat: {
            options: {
                seperator: grunt.util.linefeed
            }
        },
        /**
         * ---------------------------- COPY ----------------------------
         *
         *  Copies remaining files to places other tasks can use
         **/
        copy: {

            assets: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= appconfig.app %>',
                    dest: '<%= appconfig.dist %>',
                    src: [
                        'favicon.png'
                    ]
                }, {
                    expand: true,
                    cwd: '<%= appconfig.app %>',
                    src: ['asteria_data.json'],
                    dest: '<%= appconfig.dist %>'
                }, {
                    expand: true,
                    cwd: '<%= appconfig.app %>',
                    src: ['index.html'],
                    dest: '<%= appconfig.dist %>'
                }]
            }
        },
        /**
         * ---------------------------- CSSMIN ----------------------------
         *
         *  Minify CSS
         **/
        cssmin: {
            clubCSS: {
                files: {
                    '<%= appconfig.dist %>/main.css': [
                        'bower_components/angular-material/angular-material.css',
                        'src/*.css'
                    ]
                }
            }
        },
        /**
         * ---------------------------- JSHINT ----------------------------
         *
         *  
         **/
        jshint: {
            app: ['<%= appconfig.app %>/*.js']
        },
        /**
         * ---------------------------- HTMLMIN ----------------------------
         *
         **/
        htmlmin: {
            options: { collapseWhitespace: true, removeComments: true },
            index: {
                files: [{
                    expand: true,
                    cwd: '<%= appconfig.dist %>',
                    src: ['index.html'],
                    dest: '<%= appconfig.dist %>'
                }]
            }

        },

        /**
         * ---------------------------- UGLIFY ----------------------------
         *
         **/
        uglify: {
            options: {
                mangle: true,
                // the banner is inserted at the top of the output
                banner: '/**\n * <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %>\n **/\n'


            },
            dist: {
                files: {

                    '<%= appconfig.dist %>/app.js': ['<%= appconfig.dist %>/app.js'],
                }

            }
        },
        /**
         * ---------------------------- USEMINPREPARE ----------------------------
         *
         *  Reads HTML for usemin blocks to enable smart builds that automatically
         *  concat, minify and revision files. Creates configurations in memory so
         *  additional tasks can operate on them
         *
         *
         *
         *  The built-in tasks of usemin
         *  It prepares the configuration to transform specific blocks in the scrutinized
         *  file into a single line, targeting an optimized version of the files. 
         **/
        useminPrepare: {
            html: 'src/index.html',
            options: {
                dest: '<%= appconfig.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat']
                        },
                        post: {

                        }
                    }
                }
            }
        },

        /**
         * ---------------------------- USEMIN ----------------------------
         *
         *  Performs rewrites based on filerev and the useminPrepare configuration
         **/
        usemin: {
            html: 'dist/index.html'
        },
    });

    // grunt.registerTask('default', ['clean', 'useminPrepare']);
    grunt.registerTask('default', function() {
        grunt.task.run(['clean', 'jshint:app','copy:assets', 'useminPrepare', 'cssmin', 'concat:generated', 'uglify', 'usemin', 'htmlmin:index']);

    });




};