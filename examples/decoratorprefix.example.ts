import extol, { extolPrefix } from '../src';

/**
 * Example class to show automated externalization
 */
@extolPrefix('example')
class ExampleConfiguration {
  @extol('localhost')
  host: string;

  @extol(5672)
  port: number;

  @extol('guest')
  username: string;

  toString(): string {
    return `ExampleConfiguration {
      host: ${this.host}, type=${this.host?.constructor?.name},
      port: ${this.port}, type=${this.port?.constructor?.name},
      username: ${this.username}, type=${this.username?.constructor?.name},
    }`;
  }
}

/**
 * Default instance
 */
const c = new ExampleConfiguration();
console.log(c.toString());
