import extol from '../src/externalization';

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
