module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);
  var appConfig = {
    app: 'd1',
    port: '3003',
    dist: 'dist'
  };
  var bs;

  grunt.initConfig({
    appConfig: appConfig,
    pkg: grunt.file.readJSON('package.json'),
    // 开启同步服务
    browserSync: {
      dev: {
        bsFiles: {
          src: [
            'Gruntfile.js',
            './<%= appConfig.app %>/{,*/}*.ejs',
            './<%= appConfig.app %>/{,*/}*.html',
            './<%= appConfig.app %>/{,*/}*.css',
            './<%= appConfig.app %>/{,*/}*.js'
          ]
        },
        options: {
          proxy: 'localhost:3000',
          //server: {
          //	baseDir: "./<%= appConfig.app %>/",
          //	// 将bower的路径改为相对于项目的路径
          //	routes: {
          //		"/bower_components": "bower_components"
          //	}
          //},
          // 开启实时监控
          watchTask: true // < VERY important
        }
      }
    },
    // 实时监控文件变化
    watch: {
      comp: {
        files: '<%= appConfig.app %>/public/scss/{,*/}*.scss',
        tasks: ['compass']
      }
    },
    compass: {
      dist: {
        options: {
          config: 'config.rb'
        }
      }
    },
    concurrent: {
      target: {
        tasks: ['watch', 'nodemon'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    typescript: {
      base: {
        src: '<%= appConfig.app %>/public/typescript/{,*/}*.ts',
        dest: '<%= appConfig.app %>/public/js',
        options: {
          //module: 'amd',
          //target: 'es6',
          rootDir: '<%= appConfig.app %>/public/typescript/',
          sourceMap: true//,
          //watch: true //Detect all target files root. eg: 'path/to/typescript/files/'
        }
      }
    },
    wiredep: {

      task: {

        // Point to the files that should be updated when
        // you run `grunt wiredep`
        src: [
          '<%= appConfig.app %>/views/{,*/}*.html'//,   // .html support...
          //'app/views/**/*.jade',   // .jade support...
          //'app/styles/main.scss',  // .scss & .sass support...
          //'app/config.yml'         // and .yml & .yaml support out of the box!
        ],

        options: {
          // See wiredep's configuration documentation for the options
          // you may pass:

          // https://github.com/taptapship/wiredep#configuration
        }
      }
    },
    nodemon: {
      dev: {
        script: '<%= appConfig.app %>/bin/www',
        options: {
          watch: ['<%= appConfig.app %>'],
          ext: 'html, js, css',
          env: {
            PORT: appConfig.port
          },
          ignore: ['node_modules/**'],
          // omit this property if you aren't serving HTML files and
          // don't want to open a browser tab on start
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });

            // opens browser on initial server start
            nodemon.on('config:update', function () {
              // Delay before server listens on port
              //console.log('config update');
            });

            // refreshes browser when server reboots
            nodemon.on('restart', function () {
              // Delay before server listens on port
              console.log('nodemon restart');

              bs.reload();
            });

            nodemon.on('start', function () {
              // Delay before server listens on port
              console.log('nodemon start');
              //browserSync.reload();
              if (!bs) {
                console.log('create bs');
                bs = require("browser-sync").create();
                bs.init({
                  proxy: {
                    target: 'localhost:' + appConfig.port
                  }
                  //port: 3000,
                  //server: {
                  //	baseDir: appConfig.app
                  //},
                  //open: 'localhost'
                });
                bs.watch([
                  appConfig.app + '/**/*.html',
                  appConfig.app + '/**/*.ejs',
                  appConfig.app + '/**/*.js',
                  appConfig.app + '/**/*.css'
                ]).on('change', function () {
                  console.log('*----change----*');
                  nodemon.restart();
                });

              }

            });
          }
        }
      }
    }
  });

};
