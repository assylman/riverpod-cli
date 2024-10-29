import fs from 'fs';
import os from 'os';
import { Commands, delay, toPascalCase } from '../utils';
import { generateManager } from '../managers';
import { generateRepository } from '../repositories';
import { generateService } from '../services';
import { generateProvider } from '../providers';

export async function generateFeature(name: string, options: any) {
    const serviceOptions = { ...options, l: true, r: true };
    generateService(name, serviceOptions);

    await delay(300);
    generateRepository(name, options);

    await delay(300);
    generateManager(name, options);

    if (options.p) {
        await delay(300);
        generateProvider(name, options, Commands.feature);
    }
}

export function generateFeatureIndexFile(
    name: string,
    command: string,
    featureDirectory: string,
) {
    const dir = featureDirectory + '/' + name + '.dart';

    if (!fs.existsSync(dir)) {
        fs.writeFileSync(
            dir,
            generateInitialIndexFile(name, command),
            { flag: "w" },
        );
    } else {
        fs.writeFileSync(
            dir,
            generateIndexFile(name, dir, command),
            { flag: "w" },
        );
    }
}

function generateInitialIndexFile(name: string, command: string) {
    const content = [
        `/// ${toPascalCase(name)} feature`,
        `///`,
        `///`,
        ``,
        `library;`,
        ``,
    ];

    if (command.match(Commands.service)) {
        content.push(`export './services/services.dart';`);
    }

    if (command.match(Commands.manager)) {
        content.push(`export './managers/managers.dart';`);
    }

    if (command.match(Commands.repository)) {
        content.push(`export './repositories/repositories.dart';`);
    }

    return content.join('\n');
}


function generateIndexFile(name: string, dir: string, command: string) {
    const data = fs.readFileSync(dir, { encoding: 'utf-8' });
    const splittedData = data.split(os.EOL);

    var exports: { [id: number]: string; } = {};
    for (let i = 0; i < splittedData.length; i++) {
        let value = splittedData[i];
        if (value) {
            if (value.startsWith('export')) {
                exports[i] = value.replace('export ', '');
            }
        }
    }

    if (splittedData[splittedData.length - 1] == '') {
        splittedData.splice(-1);
    }

    const managerExports = 'export \'./managers/managers.dart\';';
    const serviceExports = 'export \'./services/services.dart\';';
    const repositoryExports = 'export \'./repositories/repositories.dart\';';

    if (command.includes(Commands.manager)) {
        if (!splittedData.includes(managerExports)) {
            splittedData.push(managerExports);
        }
    }

    if (command.includes(Commands.repository)) {
        if (!splittedData.includes(repositoryExports)) {
            splittedData.push(repositoryExports);
        }
    }

    if (command.includes(Commands.service)) {
        if (!splittedData.includes(serviceExports)) {
            splittedData.push(serviceExports);
        }
    }

    fs.unlinkSync(dir);

    return splittedData.join('\n');
}