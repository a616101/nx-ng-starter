import { libraryGenerator } from '@nrwl/angular/generators';
import {
  generateFiles,
  joinPathFragments,
  logger,
  ProjectConfiguration,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { exec } from 'child_process';
import { unlink } from 'fs/promises';
import { fileExists } from 'nx/src/utils/fileutils';
import { promisify } from 'util';

import { ISchematicContext } from './schema.interface';

/**
 * Adds/replaces files generated for a library by default.
 */
const addFiles = (schema: ISchematicContext, tree: Tree) => {
  const config: ProjectConfiguration = readProjectConfiguration(tree, schema.name);
  const root = config.root;

  generateFiles(tree, joinPathFragments(__dirname, './files'), root, {
    tmpl: '',
    name: schema.name,
  });
};

/**
 * Updates project.json
 */
const updateProjectConfig = (schema: ISchematicContext, tree: Tree) => {
  const projectConfig: ProjectConfiguration = readProjectConfiguration(tree, schema.name);
  if (typeof projectConfig.targets !== 'undefined') {
    projectConfig.targets.lint.executor = '@angular-eslint/builder:lint';
    projectConfig.targets.lint.options = {
      ...(projectConfig.targets.lint.options ?? {}),
      eslintConfig: `libs/${schema.name}/.eslintrc.json`,
      lintFilePatterns: [`libs/${schema.name}/**/*.ts`],
    };
    projectConfig.targets.lint.outputs = ['{options.outputFile}'];
  }

  updateProjectConfiguration(tree, schema.name, projectConfig);
};

/**
 * Removes unneeded files.
 */
const cleanup = async (): Promise<void> => {
  const root = `${process.cwd()}`;
  const rootEslintJson = `${root}/.eslintrc.json`;
  const eslintJsonExists = fileExists(rootEslintJson);
  if (eslintJsonExists) {
    await unlink(rootEslintJson);
  }
};

export default async function (tree: Tree, schema: ISchematicContext) {
  const name = schema.name;
  const tags = schema.tags;

  await libraryGenerator(tree, {
    name,
    prefix: 'app',
    standaloneConfig: true,
    tags,
  });

  addFiles(schema, tree);

  updateProjectConfig(schema, tree);

  await cleanup();

  return async () => {
    const { stdout, stderr } = await promisify(exec)(`npx nx run tools:tsc-configure`);
    logger.log(stdout);
    logger.error(stderr);
    return { success: stderr === '' };
  };
}
