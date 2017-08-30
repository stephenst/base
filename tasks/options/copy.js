(function () {
    var vendorFiles = [{
        expand: true,
        dot: false,
        cwd: "",
        dest: "build/_assets/js/",
        src: [
            "node_modules/angular/angular.js",
            "node_modules/angular-animate/angular-animate.js",
            "node_modules/angular-aria/angular-aria.js",
            "node_modules/angular-cookies/angular-cookies.js",
            "node_modules/angular-filter/dist/angular-filter.js",
            "node_modules/angular-messages/angular-messages.js",
            "node_modules/angular-resource/angular-resource.js",
            "node_modules/angular-sanitize/angular-sanitize.js",
            "node_modules/angular-gettext/dist/angular-gettext.js",
            "node_modules/angular-ui-router/release/angular-ui-router.js",
            "node_modules/angular-ui-bootstrap/ui-bootstrap-tpls.js",
            "node_modules/angular-nvd3/dist/angular-nvd3.js",
            "node_modules/angular-openlayers-directive/dist/angular-openlayers-directive.js",
            "node_modules/cesium/Build/Cesium/Cesium.js",
            "node_modules/jqwidgets-framework/jqwidgets/jqx-all.js",
            "node_modules/ol/index.js",
            "node_modules/angular-growl-v2/build/angular-growl.js",
            "node_modules/angular-ui-grid/ui-grid.js"
        ]
    }];
    var allFiles = [{
        expand: true,
        dot: false,
        cwd: "app",
        dest: "build",
        src: [
            "**/*.{ico,png,jpg,gif,html,css,json,md}"
        ]
    }, {
        expand: true,
        dot: false,
        cwd: "app/_assets/bower/",
        dest: "build/_assets/bower/",
        src: [
            "{,**/}*.js"
        ]
    }, {
        expand: true,
        dot: false,
        cwd: ".tmp/concat/_assets/js/",
        dest: "build/_assets/js/",
        src: [
            "{,**/}*.js"
        ]
    }, {
        expand: true,
        dot: false,
        cwd: "app/concat/_assets/css/",
        dest: "build/_assets/css/",
        src: [
            "{,**/}*.css"
        ]
    }, {
        expand: true,
        dot: false,
        cwd: "app/_assets/bower/font-awesome/fonts/",
        dest: "build/_assets/bower/font-awesome/fonts/",
        src: [
            "{,**/}*.{otf,eot,svg,ttf,woff,woff2}"
        ]
    }, {
        expand: true,
        dot: false,
        cwd: "app/_assets/fonts/",
        dest: "build/_assets/fonts/",
        src: [
            "{,**/}*.{otf,eot,svg,ttf,woff,woff2}"
        ]
    }];

    var sourceMaps = {
        expand: true,
        dot: false,
        cwd: "app",
        dest: "build",
        src: [
            "**/*.map"
        ]
    };

    module.exports = {
        dev: {
            files: allFiles
        },
        vendor: {
            files: vendorFiles.concat()
        },
        prod: {
            options: {
                noProcess: "app/_assets/bower"
            },
            files: allFiles.concat(sourceMaps)
        },
        dist: {
            options: {
                noProcess: "app/_assets/bower"
            },
            files: allFiles
        },
        sourceHTML: {
            options: {
            },
            files: [
                {
                    expand: true,
                    dot: false,
                    cwd: "app",
                    dest: "build",
                    src: [
                        "**/*.html"
                    ]
                }
            ]
        }
    };
}());
