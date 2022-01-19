import { loadObject } from '../src';

/**
 * loadObject takes a key-to-defaultvalue map
 * A common prefix may be provided.
 */
const config = loadObject(
  {
    host: 'localhost',
    port: 5672,
    protocol: 'amqp',
    username: 'guest',
    password: 'guest',
    rememberPassword: false,
  },
  { envVarPrefix: 'example' },
);

/**
 * Demonstrate
 */
console.log(`loadObject {
  host: ${config.host}, type=${config.host?.constructor?.name},
  port: ${config.port}, type=${config.port?.constructor?.name},
  protocol: ${config.protocol}, type=${config.protocol?.constructor?.name},
  username: ${config.username}, type=${config.username?.constructor?.name},
  password: ${config.password}, type=${config.password?.constructor?.name},
  rememberPassword: ${config.rememberPassword}, type=${config.rememberPassword?.constructor?.name}
}`);
