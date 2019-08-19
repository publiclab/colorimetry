module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-browser-sync');
  
    require('matchdep')
      .filterDev('grunt-*')
      .forEach(grunt.loadNpmTasks);
  
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
  
      watch: {
        options: {
          livereload: true
        },
        source: {
          files: ['src/*', 'Gruntfile.js'],
          tasks: ['compile']
        }
      },
  
      browserify: {
        core: {
          src: ['src/colorimetry.js'],
          dest: 'build/main.js'
        }
      },
  
      uglify: {
        core: {
          src: ['./build/main.js'],
          dest: './build/main.min.js'
        },
      },
      browserSync: {
        dev: {
          options: {
            watchTask: true,
            server: './'
          }
        }
      }
    });
  
    /* Default (development): Watch files and build on change. */
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['browserify:core', 'uglify:core']);
    grunt.registerTask('serve', ['browserify:core',  'browserSync', 'watch']);
    grunt.registerTask('compile', ['browserify:core']);
  };
  