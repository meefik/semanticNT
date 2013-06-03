basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'app/public/js/lib/angular/angular.js',
  'app/public/js/lib/angular/angular-*.js',
  'test/lib/angular/angular-mocks.js',
  'app/public/js/*.js',
  'app/public/js/lib/jquery.js',
  'app/public/js/lib/bootstrap.js',
  'app/public/js/lib/markitup/**/*.js',
  'test/unit/**/*.js'
];

autoWatch = true;

browsers = ['Firefox'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
