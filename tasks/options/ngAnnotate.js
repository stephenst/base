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
                'app/components/**/*.module.js',
                'app/components/**/*.+(controller|service|factory|directive|filter).js',
                '!app/components/**/*spec.js',
                '!app/_assets/bower/',
                '!app/_assets/js/'
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
