module.exports = {
    options: {
        protocol: "http",
        hostname: "localhost",
        port: "8082",
        //  open: {
        //      // target: 'http://localhost:9000', NW!
        //      // name of the app that opens, ie: open, start, xdg-open
        //      appName: "<%= cfg.env.browser %>"
        //  },
        // otherwise it exits with the end of task
        // keepalive: false // watch adds this
        livereload: true     // use browser extension
    },
    /**
     * Run local dev (non min, non concat) version
     * served from `app` folder and parent `.tmp` and `bower_components`
     */
    devlocal: {
        options: {
            /**
             * middleware connect - dev
             *
             * @param {Function} connect
             * @returns {*[]}
             */
            middleware: function (connect) {
                return [
                    // connect.static(".tmp"),
                    connect.static("build")
                ];
            }
        }
    },
    prodlocal: {
        options: {
            base: "build",

            /**
             * middleware connect - prod ONLY FOR THEME
             *
             * @param {Function} connect
             * @returns {*[]}
             */
            middleware: function (connect) {
                return [
                    connect.static("build")
                ];
            }
        }
    },
    distlocal: {
        options: {
            base: "build",

            /**
             * middleware connect - dist ONLY FOR THEME
             *
             * @param {Function} connect
             * @returns {*[]}
             */
            middleware: function (connect) {
                return [
                    connect.static("build")
                ];
            }
        }
    }

};
