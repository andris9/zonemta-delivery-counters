'use strict';

const redis = require('redis');

module.exports.title = 'Stats Counter';
module.exports.init = function(app, done) {
    // prefer redis provided by the configuration
    const client = app.config.redis ? redis.createClient(app.config.redis) : app.db.redis;
    const prefix = app.config.prefix ? app.config.prefix + '_' : '';

    if (app.config.redis) {
        client.on('error', err => app.logger.error('Redis', err.message));
    }

    app.addHook('queue:release', (zone, data, next) => {
        if (!data || !data.status) {
            return next();
        }

        let date = new Date();
        let year = date.getUTCFullYear() + '';
        let month = date.getUTCMonth() + 1;
        let day = date.getUTCDate();

        month = (month < 10 ? '0' : '') + month;
        day = (day < 10 ? '0' : '') + day;

        let key = data.status.delivered ? prefix + 'delivered' : prefix + 'bounced';
        let domainKey = prefix + 'domains';

        client
            .multi()
            .incr(key)
            .incr(key + '^' + year + '/' + month + '/' + day)
            .incr(key + '_' + zone.name)
            .incr(key + '_' + zone.name + '^' + year + '/' + month + '/' + day)
            .zincrby(domainKey, 1, data.domain)
            .zincrby(domainKey + '^' + year + '/' + month + '/' + day, 1, data.domain)
            // Do not wait until counters are updated before returning
            .exec(() => false);

        setImmediate(next);
    });

    done();
};
