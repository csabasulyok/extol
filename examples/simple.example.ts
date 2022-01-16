import { load } from '../src';

/**
 * Value will be read from:
 * - HOST environment variable
 * - HOST entry in .env file
 * - default value given as second parameter
 */
const host = load<string>('host', 'localhost');

/**
 * Numeric type is retained.
 */
const port = load<number>('port', 5672);

/**
 * Prefixes may be added to the name.
 * In this case, the MESSAGING_PROTOCOL env var is read
 */
const protocol = load<string>('protocol', 'amqp', { envVarPrefix: 'messaging' });

/**
 * Override used environment variable,
 * otherwise it's deduced from property name.
 */
const username = load<string>('username', 'guest', { envVarName: 'CUSTOM_USERNAME' });

/**
 * Allow reading filename from *_FILE env var.
 * Here, if PASSWORD_FILE is set and points to a file, its content is used as the value.
 */
const password = load<string>('password', 'guest', { fileVariant: true });

/**
 * Assume JSON in env var or file, deserialize it automatically.
 */
const rememberPassword = load<boolean>('rememberPassword', false, { json: true });

const extraArgs = load<{ [key: string]: string }>('extraArgs', {}, { json: true, fileVariant: true });

/**
 * Demonstrate
 */
console.log(`ExampleConfiguration {
  host: ${host}, type=${host?.constructor?.name},
  port: ${port}, type=${port?.constructor?.name},
  protocol: ${protocol}, type=${protocol?.constructor?.name},
  username: ${username}, type=${username?.constructor?.name},
  password: ${password}, type=${password?.constructor?.name},
  rememberPassword: ${rememberPassword}, type=${rememberPassword?.constructor?.name}
  extraArgs: ${JSON.stringify(extraArgs || {})}, type=${extraArgs?.constructor?.name},
}`);
