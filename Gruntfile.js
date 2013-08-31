module.exports = function(grunt) {

	var bowerPath = "bower_components",
		distPath = "dist",
		srcPath = "src";

	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON("package.json"),
		copy: {
			dist: {
				files: [{
					src: bowerPath + "/jquery/jquery.js",
					dest: distPath + "/jquery.js"
				}, {
					src: bowerPath + "/jquery-ui/ui/jquery-ui.js",
					dest: distPath + "/jquery-ui.js"
				}, {
					src: bowerPath + "/lodash/dist/lodash.js",
					dest: distPath + "/lodash.js"
				}, {
					src: bowerPath + "/jquery-mousewheel/jquery.mousewheel.js",
					dest: distPath + "/jquery.mousewheel.js"
				}]
			}
		},
		less: {
			dev: {
				options: {
					report: false
				},
				files: [{
					dest: distPath + "/onescroll.css",
					src: srcPath + "/less/onescroll.less"
				}]
			},
			dist: {
				options: {
					report: false,
					yuicompress: true
				},
				files: [{
					dest: distPath + "/onescroll.min.css",
					src: srcPath + "/less/onescroll.less"
				}]
			}
		},
		// Banner definitions
		meta: {
			banner: "/*\n" + " *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" + " *  <%= pkg.description %>\n" + " *  <%= pkg.homepage %>\n" + " *\n" + " *  Made by <%= pkg.author.name %>\n" + " *  Under <%= pkg.license %> License\n" + " */\n"
		},

		// Lint definitions
		jshint: {
			files: ["dist/jquery.onescroll.js"],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Minify definitions
		uglify: {
			main: {
				src: ["dist/jquery.onescroll.js"],
				dest: distPath + "/jquery.onescroll.min.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		// CoffeeScript compilation
		coffee: {
			compile: {
				files: {
					"dist/jquery.onescroll.js": [
						srcPath + "/jquery.onescroll.coffee"
					]
				}
			}
		},

		watch: {
			dev: {
				files: [
					srcPath + "/**/*.coffee",
					srcPath + "/**/*.less",
				],
				tasks: ["coffee", "less:dev", "uglify"],
				options: {
					interrupt: true,
				},
			},
			full: {
				files: [
					srcPath + "/**/*.coffee",
					srcPath + "/**/*.less",
				],
				tasks: ["js", "css"],
				options: {
					interrupt: true,
				},
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-coffee");

	grunt.registerTask("css", ["less:dev", "less:dist"]);
	grunt.registerTask("js", ["coffee", "uglify"]);
	grunt.registerTask("default", ["js", "css"]);
	grunt.registerTask("travis");

};