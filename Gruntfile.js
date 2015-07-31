module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: ['Gruntfile.js', 'src/inlineSVG.js']
    },
    uglify: {
      my_target: {
        files: {
          'dist/inlineSVG.min.js': 'src/inlineSVG.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', 'jshint', 'uglify');

};
