#!/usr/bin/env tsx

import dotenv from 'dotenv';
import extol, { extolPrefix, WithExtolProps } from '../src/index.js';

// Load environment variables from demonstration .env file
dotenv.config({
  path: 'examples/prefixed.env',
});

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

// overwrite port
c.port = 5673;

// cannot overwrite readOnly username
try {
  c.username = 'unwritable';
} catch (error) {
  console.log('As expected: Could not overwrite username', error);
}

console.log(c.extolProps());
