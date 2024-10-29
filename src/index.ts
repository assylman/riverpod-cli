#! /usr/bin/env node

import { Command } from 'commander';
import { generateService } from './services';
import { generateManager } from './managers';
import { Commands, getInformationFromPubspec } from './utils';
import { generateRepository } from './repositories';
import { generateFeature } from './features';

const program = new Command();

program
    .command(Commands.service)
    .argument('<string>', 'service name')
    .option('-t, --target <string>', 'Path to your features directory in a format \'/lib/features\' [default value is \'/lib/features\']')
    .option('--use-imports <string>', 'Pass \'relative\', if you want relative imports. [default value is \'absolute\']')
    .option('-l', 'Create local service')
    .option('-r', 'Create remote service')
    .option('-i', 'Create index barrel files')
    .action((name: string, options) => {
        const packageInfo = getInformationFromPubspec(name, options);
        generateService(name, { ...options, ...packageInfo },);
    })
    .description('Create service with a given name');

program
    .command(Commands.repository)
    .argument('<string>', 'repository name')
    .option('-t, --target <string>', 'Path to your features directory in a format \'/lib/features\' [default value is \'/lib/features\']')
    .option('--use-imports <string>', 'Pass \'relative\', if you want relative imports. [default value is \'absolute\']')
    .option('-i', 'Create index barrel files')
    .action((name: string, options) => {
        const packageInfo = getInformationFromPubspec(name, options);
        generateRepository(name, { ...options, ...packageInfo },);
    })
    .description('Create repository with a given name');

program
    .command(Commands.manager)
    .argument('<string>', 'manager name')
    .option('-t, --target <string>', 'Path to your features directory in a format \'/lib/features\' [default value is \'/lib/features\']')
    .option('--use-imports <string>', 'Pass \'relative\', if you want relative imports. [default value is \'absolute\']')
    .option('-i', 'Create index barrel files')
    .action((name: string, options) => {
        const packageInfo = getInformationFromPubspec(name, options);
        generateManager(name, { ...options, ...packageInfo });
    })
    .description('Create manager with a given name');

program
    .command(Commands.feature)
    .argument('<string>', 'feature name')
    .option('-t, --target <string>', 'Path to your features directory in a format \'/lib/features\' [default value is \'/lib/features\']')
    .option('--use-imports <string>', 'Pass \'relative\', if you want relative imports. [default value is \'absolute\']')
    .option('-i', 'Create index barrel files')
    .option('-p', 'Create feature\'s providers file')
    .action((name: string, options) => {
        const packageInfo = getInformationFromPubspec(name, options);

        generateFeature(name, { ...options, ...packageInfo });
    })
    .description('Create feature [manager, repository, service] with a given name');

program.parse(process.argv);


