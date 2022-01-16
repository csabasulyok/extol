import { constantCase } from 'change-case';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Decorator settings
 */
export type ExtolDecoratorProperties = {
  /**
   * Override environment variable name to be checked for a property.
   * If unset, "constant case" of property name is taken.
   */
  envVarName?: string;
  /**
   * Prefix given for environment variable.
   * Should be used when rest of name should be taken from property.
   * Ignored if envVarName is set.
   */
  envVarPrefix?: string;
  /**
   * Set to true so any overriding value (from file or env var)
   * is treated as JSON and parsed when reading the config.
   */
  json?: boolean;
  /**
   * Set to true so config can be set both directly as env var,
   * and as a file with the env var containing the file name.
   */
  fileVariant?: boolean;
};

/**
 * Check if _FILE suffixed version is set for a given environment variable.
 * If so, read its value into a string, otherwise check the original env var.
 */
export const fileVariant = (envVarName: string): string => {
  const fileEnvVarName = `${envVarName}_FILE`;
  const fileEnvVar = process.env[fileEnvVarName];

  if (!fileEnvVar || !fs.existsSync(fileEnvVar)) {
    // file variant not provided or file doesn't exist, return regular env var
    return process.env[envVarName];
  }

  return fs.readFileSync(fileEnvVar).toString().trim();
};

/**
 * De-facto configuration loading.
 * Should be called only once for each key/setting.
 */
export const load = <T = string>(propertyKey: string | symbol, defaultValue: T = undefined, options: ExtolDecoratorProperties = {}): T => {
  // decide environment variable name
  const finalPropertyKey = options.envVarPrefix ? `${options.envVarPrefix}_${String(propertyKey)}` : String(propertyKey);
  const envVarName = options.envVarName || constantCase(finalPropertyKey);

  // get string version from file content or environment variable
  let stringValue: string;
  if (options.fileVariant) {
    stringValue = fileVariant(envVarName);
  } else {
    stringValue = process.env[envVarName];
  }

  let value: T;

  // if externalized string version was read, cast to correct type
  if (stringValue) {
    // if JSON, deserialize
    if (options.json) {
      try {
        value = JSON.parse(stringValue);
      } catch (ex) {
        console.warn(`Could not load JSON config from ${envVarName}, regressing to default...`);
        // regress to default
      }
    } else {
      // if non-JSON externalized value, make it same type as default value
      const caster = defaultValue?.constructor || String;
      value = caster(stringValue);
    }
  }

  // check if anything overwrote the default value, otherwise regress to it
  return value !== undefined ? value : defaultValue;
};

/**
 * Property decorator function to auto-load prop value
 * from environment variable or file.
 */
const extol = <T>(defaultValue: T = undefined, options: ExtolDecoratorProperties = {}): PropertyDecorator => {
  return (target: unknown, propertyKey: string | symbol) => {
    let initialized = false;
    let value: T;
    // target[propertyKey] = defaultValue;
    Object.defineProperty(target, propertyKey, {
      get: () => {
        if (!initialized) {
          // check if prefix added
          const prefix = (target as Record<string, unknown>)?.__prefix as string;
          if (prefix) {
            options.envVarPrefix = options.envVarPrefix || prefix;
          }
          value = load(propertyKey, defaultValue, options);
          initialized = true;
        }
        return value;
      },
    });
  };
};

/**
 * Class decorator, which sets prefix for any extoled value in class
 */
export const extolPrefix = (prefix: string): ClassDecorator => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (ctr: Function) => {
    // eslint-disable-next-line no-underscore-dangle
    ctr.prototype.__prefix = prefix;
  };
};

export default extol;
