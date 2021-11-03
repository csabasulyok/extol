# extol

**Simple decorator-driven TypeScript externalization library.**

Install with:

```bash
npm i extol
```

## Functionalities

- Read environment variables, `.env` files (via the `dotenv` library) or regress to default values
- Type safety
- Read values either from file (for secrets)
- Read complex types from markup formats, e.g. JSON

## Usage

### Decorators

- run `npm run example:decorators`

```ts
import extol from 'extol';

/**
 * Example class to show automated externalization
 */
class ExampleConfiguration {
  /**
   * Value will be read from:
   * - HOST environment variable
   * - HOST entry in .env file
   * - default value given as parameter
   */
  @extol('localhost')
  host: string;

  /**
   * Numeric type is retained.
   */
  @extol(5672)
  port: number;

  /**
   * Override used environment variable,
   * otherwise it's deduced from property name.
   */
  @extol('guest', { envVarName: 'CUSTOM_USERNAME' })
  username: string;

  /**
   * Allow reading filename from *_FILE env var.
   * Here, if PASSWORD_FILE is set and points to a file, its content is used as the value.
   */
  @extol('guest', { fileVariant: true })
  password: string;

  /**
   * Assume JSON in env var or file, deserialize it automatically.
   */
  @extol(false, { json: true })
  rememberPassword: boolean;

  @extol({}, { json: true, fileVariant: true })
  extraArgs: { [key: string]: string };

  toString(): string {
    return `ExampleConfiguration {
      host: ${this.host}, type=${this.host?.constructor?.name},
      port: ${this.port}, type=${this.port?.constructor?.name},
      username: ${this.username}, type=${this.username?.constructor?.name},
      password: ${this.password}, type=${this.password?.constructor?.name},
      rememberPassword: ${this.rememberPassword}, type=${this.rememberPassword?.constructor?.name}
      extraArgs: ${JSON.stringify(this.extraArgs || {})}, type=${this.extraArgs?.constructor?.name},
    }`;
  }
}

/**
 * Default instance
 */
const c = new ExampleConfiguration();
console.log(c.toString());
```

### Simple

- run `npm run example:simple`

```ts
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
  username: ${username}, type=${username?.constructor?.name},
  password: ${password}, type=${password?.constructor?.name},
  rememberPassword: ${rememberPassword}, type=${rememberPassword?.constructor?.name}
  extraArgs: ${JSON.stringify(extraArgs || {})}, type=${extraArgs?.constructor?.name},
}`);
```