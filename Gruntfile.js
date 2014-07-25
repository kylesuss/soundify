module.exports = function(grunt) {
  grunt.initConfig({

    watch: {
      jade: {
        files: ['*.jade', 'app/views/*.jade'],
        tasks: ['jade']
      },
      sass: {
        files: ['app/stylesheets/*.scss', 'app/stylesheets/*/*.scss'],
        tasks: ['sass']
      },
      traceur: {
        files: ['app/javascripts/classes/*.js', 'app/javascripts/views/*.js', 'app/javascripts/models/*.js', 'app/javascripts/collections/*.js'],
        tasks: ['traceur']
      },
      concat: {
        files: ['app/javascripts/components/*.js'],
        tasks: ['concat']
      }
    },

    jade: {
      compile: {
        options: {
          debug: false,
          pretty: true
        },
        files: {
          'index.html': ['index.jade']
        }
      }
    },

    connect: {
      'static': {
        options: {
          hostname: 'localhost',
          port: 8000,
          keepalive: true
        }
      }
    },

    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'app/stylesheets/style.css': 'app/stylesheets/style.scss'
        }
      }
    },

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['app/javascripts/components/*.js'],
        dest: 'app/javascripts/build/components.js',
      },
    },

    traceur: {
      options: {
        includeRuntime: false
      },
      custom: {
        files:{
          'app/javascripts/build/classes.js': ['app/javascripts/classes/*.js'],
          'app/javascripts/build/views.js': ['app/javascripts/views/*.js'],
          'app/javascripts/build/models.js': ['app/javascripts/models/*.js'],
          'app/javascripts/build/collections.js': ['app/javascripts/collections/*.js'],
        }
      },
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-traceur');

  grunt.registerTask('default', ['jade']);
}