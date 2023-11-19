import extol, { extolPrefix, WithExtolProps } from '../src';

/**
 * Example class to show automated externalization
 */
@extolPrefix('example')
class ExampleConfiguration extends WithExtolProps<ExampleConfiguration> {
  @extol('localhost')
  host: string;

  @extol(5672)
  port: number;

  @extol('guest', { readOnly: true })
  username: string;
}

/**
 * Default instance
 */
const c = new ExampleConfiguration();
c.port = 5673;
// c.username = 'unwritable';
console.log(c.extolProps());
