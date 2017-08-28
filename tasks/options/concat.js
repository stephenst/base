module.exports = {
    options: {
        separator: ";"
    },
    vendorJs: {
        src: [
            "node_modules/jquery/dist/jquery.js",
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
            "node_modules/cesium/Build/CesiumUnminified/Cesium.js",
            "node_modules/jqwidgets-framework/jqwidgets/scripts/demos.js",
            "node_modules/jqwidgets-framework/jqwidgets/jqwidgets/jqxcore.js",
            "node_modules/jqwidgets-framework/jqwidgets/jqwidgets/jqxbuttons.js",
            "node_modules/jqwidgets-framework/jqwidgets/jqwidgets/jqxscrollbar.js",
            "node_modules/jqwidgets-framework/jqwidgets/jqwidgets/jqxdata.js",
            "node_modules/jqwidgets-framework/jqwidgets/jqwidgets/jqxmenu.js",
            "node_modules/jqwidgets-framework/jqwidgets/jqwidgets/jqxtooltip.js",
            "node_modules/jqwidgets-framework/jqwidgets/jqwidgets/jqxlistbox.js",
            "node_modules/jqwidgets-framework/jqwidgets/jqwidgets/jqxdropdownlist.js",
            "node_modules/jqwidgets-framework/jqwidgets/jqwidgets/jqxnumberinput.js",
            "node_modules/jqwidgets-framework/jqwidgets/jqwidgets/jqxradiobutton.js",
            "node_modules/jqwidgets-framework/jqwidgets/jqwidgets/jqxinput.js",
            "node_modules/jqwidgets-framework/jqwidgets/jqwidgets/jqxcore.js",
            "node_modules/jqwidgets-framework/jqwidgets/jqwidgets/jqxribbon.js",
            "node_modules/jqwidgets-framework/jqwidgets/jqwidgets/jqxlayout.js",
            "node_modules/jqwidgets-framework/jqwidgets/jqwidgets/jqxdocking.js",
            "node_modules/jqwidgets-framework/jqwidgets/jqwidgets/jqxdockinglayout.js",
            "node_modules/jqwidgets-framework/jqwidgets/jqwidgets/jqxtree.js",
            "node_modules/jqwidgets-framework/jqwidgets/jqwidgets/jqxwindow.js",
            "node_modules/jqwidgets-framework/jqwidgets/jqwidgets/jqxangular.js",

            "node_modules/angular-growl-v2/build/angular-growl.js"

        ],
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
