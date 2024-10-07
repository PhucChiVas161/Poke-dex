const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const name = process.argv[2]
const folderPath = `src/app/modules/${name}`

const baseApiUrl = '${baseApiUrl}'
const id = '${id}'

function toPascalCase(str) {
	return str
		.split('-') // Split the string by hyphen
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter
		.join('') // Join the words together
}

if (!name) {
	console.error('Please provide a name for the component, service, store, and type.')
	process.exit(1)
}

try {
	// Generate component
	execSync(`ng generate component ${name} --flat --skip-tests --path ${folderPath}`, { stdio: 'inherit' })

	// Generate service
	// execSync(
	//   `ng generate service ${name} --flat --skip-tests --path ${folderPath}`,
	//   { stdio: "inherit" }
	// );

	const pascalName = toPascalCase(name)

	const serviceFilePath = path.join(folderPath, `${name}.service.ts`)
	fs.writeFileSync(
		serviceFilePath,
		`
import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { of } from "rxjs";

import { createInjectionToken } from "~/core/utils/create-injection-token";
import { environment } from 'environments';
import { ${pascalName} } from "./${name}.type";


export const [inject${pascalName}Service, provide${pascalName}Store] = createInjectionToken(() => {
  const httpClient = inject(HttpClient);
  const baseApiUrl = environment().apiUrls;

  return {
      // get: (id: number | undefined) => {
      //   return id ? httpClient.get<${pascalName}>(\`${baseApiUrl}/api/${name}/${id}\`) :
      //     of({} as ${pascalName});
      // },
      }
  },
  { isRoot: true });
`,
		'utf8'
	)

	// Create store file
	const storeFilePath = path.join(folderPath, `${name}.store.ts`)
	fs.writeFileSync(
		storeFilePath,
		`
import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed } from '@angular/core';

import { ${pascalName} } from './${name}.type';
import { inject${pascalName}Service } from './${name}.service';

type ${pascalName}State = {
  data: ${pascalName};
  isLoading: boolean;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: ${pascalName}State = {
  data: {} as ${pascalName},
  isLoading: false,
  filter: { query: '', order: 'asc' },
};

export const ${pascalName}Store = signalStore(
  withState(initialState),
  withComputed(({ data, filter }) => ({
    // Computed properties for the ${pascalName} object
    // query: computed(() => filter().query),
  })),
  withMethods((store, service = inject${pascalName}Service()) => ({
    // increment1(): void {
    //   patchState(store, { count1: store.count1() + 1 });
    // },
  })),
);
`,
		'utf8'
	)

	// Create type file
	const typeFilePath = path.join(folderPath, `${name}.type.ts`)
	fs.writeFileSync(
		typeFilePath,
		`
export interface ${pascalName} {
  // Type definitions for the ${pascalName} object
}
`,
		'utf8'
	)

	console.log(`Generated component, service, store, and type files for ${name} in ${folderPath}`)
} catch (error) {
	console.error('Error generating files:', error.message)
}
