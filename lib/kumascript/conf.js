var _ = require('underscore'),
    fs = require('fs'),
    nconf = require('nconf');

// ### Default configuration settings
// This could go in `kumascript_settings.json` in the parent project.
var DEFAULT_CONFIG = {
    log: {
        console: true
    },
    statsd: {
        enabled: false,
        host: '127.0.0.1',
        port: 8125
    },
    newrelic: {
        high_security: true,
        app_name: ['developer-local.allizom.org-kumascript'],
        license_key: '',
        logging: {
            level: 'info'
        }
    },
    server: {
        port: 9080,
        numWorkers: 4,
        workerConcurrency: 4,
        workerTimeout: 1000 * 30,
        macro_timeout: 1000 * 30,
        workerMaxJobs: 8,
        workerRetries: 3,
        document_url_template:
            "https://developer.mozilla.org/en-US/docs/{path}?raw=1",
        template_url_template:
            "https://developer.mozilla.org/en-US/docs/en-US/Template:{name}?raw=1",
        template_cache_control: 'max-age=3600',
        template_class: 'EJSTemplate'
    },
    repl: {
        enabled: true,
        host: "127.0.0.1",
        port: 9070
    }
};

// ### Initialize configuration
//
// Attempt to load from a prioritized series of configuration values
//
// 1. Process environment variables

nconf.env();

// 2. Configuration files:
// 2a. File specified by env var `KUMASCRIPT_CONFIG`
// 2b. `kumascript_settings_local.json` in current dir
// 2c. `kumascript_settings.json` in current dir

var cwd = process.cwd(),
    conf_fns = [
        cwd + '/kumascript_settings.json',
        cwd + '/kumascript_settings_local.json',
        process.env.KUMASCRIPT_CONFIG
    ];
_.each(conf_fns, function (conf_fn) {
    if (!conf_fn) { return; }
    try { fs.statSync(conf_fn).isFile(); }
    catch (e) { return; }
    nconf.file({ file: conf_fn });
});

// Include the fallback defaults.
nconf.defaults(DEFAULT_CONFIG);

module.exports = {
    nconf: nconf
};
