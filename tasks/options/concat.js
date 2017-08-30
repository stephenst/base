module.exports = {
    options: {
        separator: ";"
    },
    vendorJs: {
        src: [],
        dest: "build/_assets/js/vendor.js"
    },
    vendorCss: {
        src: [
            "node_modules/angular-growl-v2/build/angular-growl.css",
            "node_modules/ol/ol.css",
            "node_modules/font-awesome/css/font-awesome.min.css",
            "node_modules/jqwidgets-framework/styles/site.css",
            "node_modules/cesium/CesiumUnminified/Widgets/widgets.css"
        ],
        dest: "build/_assets/css/vendor.css"
    }
};
