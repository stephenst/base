module.exports = function(grunt) {
    "use strict";

    grunt.registerTask("dev", [
        /**
         * Cleans .tmp, build, css compiled files
         */
        "clean",

        /**
         * Runs concat:generated from useminPrepare
         * Creates .tmp folder with concat files
         * Currently .tmp/concat/_assets/css (app.css, vendor.css) and /js (vendor.js)
         */
        "concat",

        /**
         * Creates build/app.js from _assets/components/
         * Concat all components to single file. This solves many other issues (e.g. no lazy-load, no bundling)
         */
        "ngAnnotate:dev",

        "jshint",

        // Run copy:sourceHTML which copies the native HTML files (not compiled from jade) to build directory for localization
        // This task is only needed in dev for the generation of pot file which is checked in by the developer
        // The subsequent copy task copies all the required files for the build.
        "copy:sourceHTML",

        /**
         * Copy concat files ./tmp/concat/_assets (currently only js files - vendor.js) to build/_assets dir
         * Copy app asset files from app/_assets/.. (except of bower components - serve static) to build/_assets dir
         * Copy i18n files
         */
        "copy:dev",

        "connect:devlocal",
        "watch"
    ]);
};
