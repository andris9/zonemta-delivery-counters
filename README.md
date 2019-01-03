# zonemta-delivery-counters

Delivery counters plugin for [ZoneMTA](https://github.com/zone-eu/zone-mta). Install this to see delivery counts and sending speed in [ZoneMTA WebAdmin](https://github.com/zone-eu/zmta-webadmin).

## Setup

Add this as a dependency for your ZoneMTA app

```
npm install zonemta-delivery-counters --save
```

Add a configuration entry in the "plugins" section of your ZoneMTA app

```json
...
  "plugins": {
    "modules/zonemta-delivery-counters": {
      "enabled": "main",
      "redis": "redis://localhost:6379/2",
      "prefix": "zmta"
    }
  }
...
```

Redis configuration is optional. If not set then the redis connection provided by ZoneMTA is used.

Please note that if you used the zone-mta-template when installing ZoneMTA (Which is the default procedure in the documentaton) zone-mta-counters is already installed for you.

## License

European Union Public License 1.1 ([details](http://ec.europa.eu/idabc/eupl.html))
