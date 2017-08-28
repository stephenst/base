module.exports = {
    src: ["app/**/*.js"],
    options: {
        config: ".jscsrc",
        excludeFiles: ["node_modules"],
        force: false,
        maxErrors: 2
    }
};
