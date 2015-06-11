// This is the main application configuration file.  It is a Grunt
// configuration file, which you can learn more about here:
// https://github.com/cowboy/grunt/blob/master/docs/configuring.md
//
module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    meta: {
      handlebars: {
        trimPath: true,
        basePath: 'client/assets/templates/',
        extension: '.html'
      }
    },

    // The clean task ensures all files are removed from the dist/ directory so
    // that no files linger from previous builds.
    clean: {
      build: {
        src: ["client/dist/", "client/assets/templates/"]
      }
    },

    stylus: {
      build: {
        files: [{
          src: "client/assets/css/main.css",
          dest: "client/stylus/main.styl"
        }]
      }
    },

    // The jst task compiles all application templates into JavaScript
    // functions with the underscore.js template function from 1.2.4.  You can
    // change the namespace and the template options, by reading this:
    // https://github.com/tbranyen/build-tasks/tree/master/jst
    //
    // The concat task depends on this file to exist, so if you decide to
    // remove this, ensure concat is updated accordingly.
    jade: {
      build: {
        files: [{
          expand: true,
          cwd: "client/app/modules",
          src: ["**/*.jade"],
          dest: "client/assets/templates/",
          ext: ".html"
        }]
      }
    },

    handlebars: {
      build: {
        files: [{
          src: "client/dist/debug/templates.js",
          dest: "client/assets/templates/*.html"
        }]
      }
    },

    // The concatenate task is used here to merge the almond require/define
    // shim and the templates into the application code.  It's named
    // dist/debug/require.js, because we want to only load one script file in
    // index.html.
    concat: {
      compile: [{
        src: [
          "client/assets/js/libs/almond.js",
          "client/dist/debug/templates.js",
          "client/dist/debug/require.js"
        ],
        dest: "client/dist/debug/require.js"
      }]
    },

    // This task uses the MinCSS Node.js project to take all your CSS files in
    // order and concatenate them into a single CSS file named index.css.  It
    // also minifies all the CSS as well.  This is named index.css, because we
    // only want to load one stylesheet in index.html.
    mincss: {
      "client/dist/release/i18nextWT.css": [
        "client/assets/css/bootstrap-2.0.2.css",
        "client/assets/css/bootstrap-responsive-2.0.2.css",
        "client/assets/css/font-awesome-2.0.css",
        "client/assets/css/chosen-0.9.8.css",
        "client/assets/css/main.css"
      ]
    },

    // Takes the built require.js file and minifies it for filesize benefits.
    min: {
      "client/dist/release/i18nextWT.js": [
        "client/dist/debug/require.js"
      ]
    },

    copy: {
      assets: {
        options: { basePath: "client/assets" },
        files: {
          "client/dist/release/assets": ["client/assets/font/**/*", "client/assets/img/**/*"]
        }
      },
      css: {
        options: { basePath: "client/dist/release" },
        files: {
          "client/dist/release/assets/css": "client/dist/release/i18nextWT.css"
        }
      },
      js: {
        options: { basePath: "client/dist/release" },
        files: {
          "client/dist/release/assets/js": "client/dist/release/i18nextWT.js"
        }
      },
      files: {
        options: { basePath: "client/assets" },
        files: {
          "client/dist/release/assets": ["client/assets/index.html", "client/assets/favicon.ico"]
        }
      }
    },

    // This task uses James Burke's excellent r.js AMD build tool.  In the
    // future other builders may be contributed as drop-in alternatives.
    requirejs: {
      // Include the main configuration file
      mainConfigFile: "client/app/config.js",

      // Output file
      out: "client/dist/debug/require.js",

      excludeShallow: [
          "admin/adminViews"
        //, "modules/common/personProfile"
      ],

      // Root application module
      name: "config",

      // Do not wrap everything in an IIFE
      wrap: false
    },

    watch: {
      jade: {
        files: "client/**/*.jade",
        tasks: "jade"
      },

      stylus: {
        files: "client/stylus/**/*.styl",
        tasks: "stylus"
      }
    }

  });

  // The default task will remove all contents inside the dist/ folder, lint
  // all your code, precompile all the underscore templates into
  // dist/debug/templates.js, compile all the application code into
  // dist/debug/require.js, and then concatenate the require/define shim
  // almond.js and dist/debug/templates.js into the require.js file.
  grunt.registerTask("default", "clean lint jade stylus handlebars requirejs concat");

  // The debug task is simply an alias to default to remain consistent with
  // debug/release.
  grunt.registerTask("debug", "default");

  // The release task will run the debug tasks and then minify the
  // dist/debug/require.js file and CSS files.
  grunt.registerTask("release", "default min mincss copy");

};
