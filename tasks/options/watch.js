module.exports = {
    options: {
        /**
         * Don't use livereload on global.
         * Live reload server would be started with the watch tasks per every target.
         * This is unnecessary, because some targets (sass) do not trigger change that effects the page at that moment
         * Instead run separate task (e.g. `devlocal`) which starts the live reload server and registers only files that
         * actually should result in a page change.
         */
        // livereload: true
    },
    scripts: {
        files: ["app/**/*.js"],
        tasks: [
            "jshint",
            "concat",
            "ngAnnotate:dev",
            "copy:dev"
        ],
        options: {
            spawn: false
        }
    },
    gruntfile: {
        files: ["gruntfile.js"]

    },
    html: {
        files: [
            "app/{,**/}*.html"
        ],
        tasks: [
            "copy:dev"
        ],
        options: {
            reload: true
        }
    },
    devlocal: {
        options: {
            // https://github.com/gruntjs/grunt-contrib-watch#optionslivereload
            livereload: "<%= cfg.env.livereload %>"
        },
        files: [
            "./{,*/}*.html",
            ".tmp/_assets/css/{,*/}*.css"
        ]
    }
};
