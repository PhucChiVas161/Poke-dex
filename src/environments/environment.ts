// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { environmentData } from './environment.data';

export const environmentVariable = () => {
  try {
    return (window as any)['_ENV'];
  } catch (e) {
    return 'local';
  }
};

export const environment = () => {
  const env = environmentVariable();
  return environmentData[env];
};

export const isLocal = () => environmentVariable() === 'local';
