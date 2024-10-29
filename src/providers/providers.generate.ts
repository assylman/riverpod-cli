import fs from 'fs';
import { Commands, toPascalCase } from '../utils';

const providersDart = '/providers.dart';

export function generateProvider(
    name: string,
    options: any,
    command: string,
) {
    const target = options.target;
    const libDir = target != null ? '.' + target : './lib/features';
    const featureDirectory = libDir + '/' + name;
    const dir = featureDirectory + providersDart;

    if (command.includes(Commands.feature)) {
        if (!fs.existsSync(dir)) {
            fs.writeFileSync(
                dir,
                generateProvidersForFeature(
                    name,
                    options,
                ),
                { flag: "w" },
            );
        }
    }

}


function generateProvidersForFeature(name: string, options: any) {
    const content = [];

    // Import services
    const importServiceName = options.i ? 'services.dart' : name + '_service.dart';
    content.push(...[
        `import 'package:flutter_riverpod/flutter_riverpod.dart';`,
        ``,
        `import './services/${importServiceName}';`,
    ]);

    // Import repositories
    const importRepositoryName = options.i ? 'repositories.dart' : name + '_repository.dart';
    content.push(...[
        `import './repositories/${importRepositoryName}';`,
    ]);

    // Import managers
    const importManagerName = options.i ? 'managers.dart' : name + '_manager.dart';
    content.push(...[
        `import './managers/${importManagerName}';`,
        ``,
    ]);

    // Declare managers
    const managerName = toPascalCase(name) + 'Manager';
    content.push(...[
        `final ${name}ManagerProvider = Provider<${managerName}>((ref) {`,
        /// add repository
        `   return ${managerName}();`,
        `});`,
        ``,
    ]);

    // Declare repositories
    const repositoryName = toPascalCase(name) + 'Repository';
    content.push(...[
        `final ${name}RepositoryProvider = Provider<${repositoryName}>((ref) {`,
        /// add local service
        /// add remote service
        `   return ${repositoryName}Impl();`,
        `});`,
        ``,
    ]);

    // Declare services
    const serviceName = toPascalCase(name) + 'Service';
    const serviceLocalName = toPascalCase(name) + 'LocalService';
    const serviceRemoteName = toPascalCase(name) + 'RemoteService';
    content.push(...[
        `final ${name}LocalServiceProvider = Provider<${serviceName}>((ref) {`,
        `   return ${serviceLocalName}();`,
        `});`,
        ``,
        `final ${name}RemoteServiceProvider = Provider<${serviceName}>((ref) {`,
        `   return ${serviceRemoteName}();`,
        `});`,
        ``,
    ]);

    return content.join('\n');
}