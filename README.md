# amp-kafka

Provides `KafkaProducer` and `KafkaConsumer` wrapperes for `kafka-node`

See `test/test.js` for usage as well as the documentation for `kafka-node` for options.

Depends on [appcelerator/docker-kafka](https://github.com/appcelerator/docker-kafka)

## development

Make/run support provided through `atomiq-cli`:

    npm install -g atomiq-cli

### Build image locally

    atomiq make build

### Development

Rebuild `dist` directory when `src` is updated

    atomiq make build

or watching for changes

    atomiq make watch-src

### Test

    atomiq test

or same thing

    docker-compose -f docker-compose.test.yml up

or testing while under Development

    # run services separately
    docker-compose -f docker-compose.services.yml up

    # run test separately
    docker-compose -f docker-compose.test-only up    
