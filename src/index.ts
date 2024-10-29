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
    .option('-t, --target <string>', 'path to your features directory in a format \'/lib/features\' [default value is \'/lib/features\']')
    .option('--use-imports <string>', 'pass \'relative\', if you want relative imports. Defaults: \'absolute\'')
    .option('-l', 'create local service')
    .option('-r', 'create remote service')
    .option('-i', 'create index barrel files')
    .option('-p', 'generate providers file')
    .action((name: string, options) => {
        const packageInfo = getInformationFromPubspec(name, options);
        generateService(name, { ...options, ...packageInfo },);
    })
    .description('Create service with a given name');

program
    .command(Commands.repository)
    .argument('<string>', 'repository name')
    .option('-t, --target <string>', 'path to your features directory in a format \'/lib/features\' [default value is \'/lib/features\']')
    .option('-i', 'create index barrel files')
    .option('-p', 'generate providers file')
    .action((name: string, options) => {
        const packageInfo = getInformationFromPubspec(name, options);
        generateRepository(name, { ...options, ...packageInfo },);
    })
    .description('Create repository with a given name');

program
    .command(Commands.manager)
    .argument('<string>', 'manager name')
    .option('-t, --target <string>', 'path to your features directory in a format \'/lib/features\' [default value is \'/lib/features\']')
    .option('-i', 'create index barrel files')
    .option('-p', 'generate providers file')
    .action((name: string, options) => {
        const packageInfo = getInformationFromPubspec(name, options);
        generateManager(name, { ...options, ...packageInfo });
    })
    .description('Create manager with a given name');

program
    .command(Commands.feature)
    .argument('<string>', 'feature name')
    .option('-t, --target <string>', 'path to your features directory in a format \'/lib/features\' [default value is \'/lib/features\']')
    .option('-i', 'create index barrel files')
    .option('-p', 'generate providers file')
    .action((name: string, options) => {
        const packageInfo = getInformationFromPubspec(name, options);

        generateFeature(name, { ...options, ...packageInfo });
    })
    .description('Create feature with a given name');

/// Execute the CLI with the given arguments
program.parse(process.argv);




//  feature 'example' -> 
//      create 'example' feature folder
//          create 'example' manager                
//              export manager
//          create 'example' service                
//              export service
//          create 'example' repository                
//              export repository
//          create 'example' state_holder
//              export state_holders
//          create providers file
//              write all providers inside providers file
//          create export barrel file
//              export every folder barrel files

//  manager 'example' -> 
//      look for feature folder called 'example'
//          if exists: create a folder manager
//          if not: create a feature folder named 'example', and then create a manager folder inside it    
//      create manager folder
//          export manager
//      look for providers:
//          if exists: add a manager as a provider
//          if not: create a providers file, and then add a manager as a provider

//  service 'example' -> 
//      look for feature folder called 'example'
//          if exists: create a folder services
//          if not: create a feature folder named 'example', and then create a service folder inside it    
//      create service folder
//          export service
//      look for providers:
//          if exists: add a service as a provider
//          if not: create a providers file, and then add a service as a provider

//  repository 'example' -> 
//      look for feature folder called 'example'
//          if exists: create a folder repository
//          if not: create a feature folder named 'example', and then create a repository folder inside it    
//      create repository folder
//          export repository
//      look for providers:
//          if exists: add a repository as a provider
//          if not: create a providers file, and then add a repository as a provider

//  state_holder 'example' -> 
//      look for feature folder called 'example'
//          if exists: create a folder state_holder
//          if not: create a feature folder named 'example', and then create a state_holder folder inside it    
//      create state_holder folder
//          export state_holder
//      look for providers:
//          if exists: add a state_holder as a provider
//          if not: create a providers file, and then add a state_holder as a provider
