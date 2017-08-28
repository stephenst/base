module.exports = {
    options: {
        // Task-specific options go here.
        singleQuotes: false
    },
    test: {
        files: {
            'build/app.js': [
                'app/app.js',
                'app/**/*.module.js',
                'app/*.js',
                'app/**/*.js',
                '!app/**/*spec.js'
            ]
        }
    },
    dev: {
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
