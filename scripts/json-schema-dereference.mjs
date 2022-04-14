import { URL } from 'url';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

import YAML from 'yaml';
import _ from 'lodash';
import $RefParser from '@apidevtools/json-schema-ref-parser';

const [input, ...output] = _.map(process.argv.slice(2), (arg) => path.normalize(path.join(process.cwd(), arg)));

const yaml = YAML.parse(await readFile(input, { encoding: 'utf8' }));

const schema = await $RefParser.dereference(yaml);

YAML.scalarOptions.str.fold = { lineWidth: 0 };

await Promise.all(_.map(output, (out) => writeFile(out, YAML.stringify(schema))));