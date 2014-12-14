module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: ['Gruntfile.js', 'inlineSVG.js']
    },
    uglify: {
      my_target: {
        files: {
          'inlineSVG.min.js': 'inlineSVG.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', 'jshint', 'uglify');

};
