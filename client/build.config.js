/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  /**
   * The `build_dir` folder is where our projects are compiled during
   * development and the `compile_dir` folder is where our app resides once it's
   * completely built.
   */
  build_dir: 'build',
  test_dir: 'test',
  compile_dir: 'bin',

  /**
   * This is a collection of file patterns that refer to our app code (the
   * stuff in `src/`). These file paths are used in the configuration of
   * build tasks. `js` is all project javascript, less tests. `ctpl` contains
   * our reusable components' (`src/common`) template HTML files, while
   * `atpl` contains the same, but for our app's code. `html` is just our
   * main HTML file, `less` is our main stylesheet, and `unit` contains our
   * app's unit tests.
   */
  app_files: {
    js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
    jsunit: [ 'src/**/*.spec.js' ],
    
    atpl: [ 'src/app/**/*.tpl.html' ],
    ctpl: [ 'src/common/**/*.tpl.html' ],

    html: [ 'src/index.html' ],
    less: 'src/less/main.less'
  },

  /**
   * This is a collection of files used during testing only.
   */
  test_files: {
    js: [
      'vendor/angular-mocks/angular-mocks.js'
    ]
  },

  /**
   * This is the same as `app_files`, except it contains patterns that
   * reference vendor code (`vendor/`) that we need to place into the build
   * process somewhere. While the `app_files` property ensures all
   * standardized files are collected for compilation, it is the user's job
   * to ensure non-standardized (i.e. vendor-related) files are handled
   * appropriately in `vendor_files.js`.
   *
   * The `vendor_files.js` property holds files to be automatically
   * concatenated and minified with our project source files.
   *
   * The `vendor_files.css` property holds any CSS files to be automatically
   * included in our app.
   *
   * The `vendor_files.assets` property holds any assets to be copied along
   * with our app's assets. This structure is flattened, so it is not
   * recommended that you use wildcards.
   */
  vendor_files: {
    js: [
      'vendor/jquery/dist/jquery.min.js',
      'vendor/angular/angular.js',
      'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'vendor/placeholders/angular-placeholders-0.0.1-SNAPSHOT.min.js',
      'vendor/angular-ui-router/release/angular-ui-router.js',
      'vendor/angular-ui-utils/modules/route/route.js',
      'vendor/restangular/dist/restangular.min.js',
      'vendor/lodash/dist/lodash.min.js',
      'vendor/angular-mocks/angular-mocks.js',
      'vendor/chartist/dist/chartist.min.js',
      'vendor/angular-filter/dist/angular-filter.min.js',
      'vendor/angular-chartist.js/dist/angular-chartist.js',
      'vendor/ladda/dist/spin.min.js',
      'vendor/ladda/dist/ladda.min.js',
      'vendor/angular-ladda/dist/angular-ladda.js',
      'vendor/raphael/raphael-min.js',
      'vendor/morris.js/morris.min.js',
      'vendor/angular-growl-v2/build/angular-growl.min.js',
      'vendor/highcharts-release/highcharts.js',
      'vendor/highcharts-ng/dist/highcharts-ng.min.js',
      'vendor/moment/min/moment.min.js',
      'vendor/angular-moment/angular-moment.min.js',
      'vendor/angular-morris-chart/src/angular-morris-chart.min.js',
      'vendor/Read-More-Directive/js/directives/readmore.js'


    ],
    css: [
       'vendor/font-awesome/css/font-awesome.min.css',
       'vendor/chartist/dist/chartist.min.css',
       'vendor/ladda/dist/ladda.min.css',
       'vendor/morris.js/morris.css',
       'vendor/angular-growl-v2/build/angular-growl.min.css'
    ],
    assets: [
    ],
    fonts: [
        'vendor/bootstrap/fonts/glyphicons-halflings-regular.eot',
        'vendor/bootstrap/fonts/glyphicons-halflings-regular.svg',
        'vendor/bootstrap/fonts/glyphicons-halflings-regular.ttf',
        'vendor/bootstrap/fonts/glyphicons-halflings-regular.woff',
        'vendor/bootstrap/fonts/glyphicons-halflings-regular.woff2',
        'vendor/font-awesome/fonts/fontawesome-webfont.eot',
        'vendor/font-awesome/fonts/fontawesome-webfont.svg',
        'vendor/font-awesome/fonts/fontawesome-webfont.ttf',
        'vendor/font-awesome/fonts/fontawesome-webfont.woff',
        'vendor/font-awesome/fonts/fontawesome-webfont.woff2'
    ]

  },
};
