'use strict';

module.exports = function configureGrunt(grunt) {

	var nodemonIgnores = [
		'karma.conf.js',
		'/client/',
		'/build/',
		'/temp/',
		'/.tmp',
		'/.sass-cache',
		'*.txt',
		'Gruntfile.js',
		'README.md',
		'/.git/',
		'/node_modules/',
		'node-inspector.js'
	];

	require('time-grunt')(grunt);

	require('matchdep')
		.filterDev('grunt-*')
		.forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		watch: {
			options: {
				livereload: true
			},
			compass: {
				files: ['client/styles/**/*.{scss,sass}'],
				tasks: ['compass:server'],
				options: {
					livereload: false,
				},
			},
		},
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'dist/*',
						'!dist/.git*'
					]
				}]
			},
			server: ['.tmp']
		},
		jshint: {
			files: [
				'Gruntfiles.js',
				'server.js',
				'lib/**/*.js',
				'client/scripts/**/*.js'
			],
			options:  {
				jshintrc: '.jshintrc'
			}
		},
		requirejs: {
			app: {
				options: {
					name: 'app',
					baseUrl: 'client/scripts/',
					shim: {
						handlebars: {
							deps: [],
							exports: 'Handlebars',
						},
						lodash: {
							deps: [],
							exports: '_',
							init: function () {
								return this._.noConflict();
							},
						}
					},
					optimize: 'uglify2',
					generateSourceMaps: true,
					preserveLicenseComments: false,
					useStrict: true,
					wrap: true,
					mainConfigFile: 'client/scripts/config.js',
					out: 'dist/client/scripts/app.dist.js'
				}
			},
		},
		nodemon: {
			dev: {
				options: {
					file: 'server.js',
					args: ['development'],
					watchedExtensions: [
						'js'
					],
					debug: true,
					delayTime: 1,
					ignoredFiles: nodemonIgnores
				}
			},
			nodeInspector: {
				options: {
					file: 'node-inspector.js',
					watchedExtensions: [
						'js'
					],
					exec: 'node-inspector',
					ignoredFiles: nodemonIgnores
				},
			},
		},
		compass: {
			options: {
				sassDir: 'client/styles',
				cssDir: '.tmp/styles',
				imagesDir: 'client/images',
				generatedImagesDir: '.tmp/images',
				fontsDir: 'client/styles/fonts',
				javascriptsDir: 'client/scripts',
				importPath: 'client/bower_components'
			},
			dist: {
				options: {
					generatedImagesDir: 'dist/client/images'
				}
			},
			server: {
				options: {
					debugInfo: true
				}
			}
		},
		cssmin: {
			dist: {
				files: {
					'dist/client/styles/styles.css': [
						'.tmp/styles/{,*/}*.css',
						'client/styles/{,*/}*.css'
					]
				}
			}
		},
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: 'client',
					dest: 'dist/client',
					src: [
						'*.{ico,png,txt}',
						'.htaccess',
						'images/**/*.{webp,gif}',
						'styles/fonts/{,*/}*.*',
					]
				}, {
					expand: true,
					dot: true,
					cwd: 'views',
					dest: 'dist/views/',
					src: '**/*.handlebars',
				}]
			},
			styles: {
				expand: true,
				dot: true,
				cwd: 'client/styles',
				dest: '.tmp/styles/',
				src: '{,*/}*.css'
			},
		},
		concurrent: {
			nodemon: {
				options: {
					logConcurrentOutput: true,
				},
				tasks: [
					'nodemon:nodeInspector',
					'nodemon:dev',
					'watch'
				]
			},
			server: [
				'compass:server',
				'copy:styles'
			],
			dist: [
				'copy:styles',
				'compass:dist'
			]
		}
	});

	grunt.registerTask('server', [
		'concurrent:server',
		'concurrent:nodemon'
	]);

	grunt.registerTask('build', [
		'clean:dist',
		'concurrent:dist',

		'requirejs:app',

		'cssmin',
		'copy:dist',
	]);

};
