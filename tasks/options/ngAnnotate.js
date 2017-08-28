module.exports = {
    options: {
        // Task-specific options go here.
        singleQuotes: false
    },
    dev: {
        files: {
            'build/app.js': [
                'app/app.js',
                'app/app.+(config|constants).js',
                'app/**/*.module.js',
                'app/**/*.+(controller|service|factory|directive|filter).js',
                '!app/**/*spec.js'
            ]
        }
    },
    prod: {
        files: {
            'build/app.js': [
                'app/app.module.js',
                'app/**/*.module.js',
                'app/*.js',
                'app/**/*.js',
                '!app/**/*spec.js'
            ]
        }
    },
    dist: {
        files: {
            'build/app.js': [
                'app/app.module.js',
                'app/**/*.module.js',
                'app/*.js',
                'app/**/*.js',
                '!app/**/*spec.js'
            ]
        }
    }
};
