import fs from 'fs';
import { Commands, toPascalCase } from "../utils";
import { generateFeatureIndexFile } from '../features';

const managerDart = '_manager.dart';
const indexDart = 'managers.dart';

export function generateManager(name: string, options: any) {
    const target = options.target;

    const libDir = target != null ? '.' + target : './lib/features';

    const featureDirectory = libDir + '/' + name;
    const managerDirectory = featureDirectory + '/managers';
    const managerFileName = managerDirectory + '/' + name + managerDart;
    const managerIndexFileName = managerDirectory + '/' + indexDart;

    const dirs = managerDirectory.split('/').filter(n => n && n != 'lib');
    var fullDirs;

    for (const dir of dirs) {
        if (!fullDirs) {
            fullDirs = './lib/' + dir;
        } else {
            fullDirs += '/' + dir;
        }

        if (!fs.existsSync(fullDirs)) {
            try {
                fs.mkdirSync(fullDirs, { recursive: true });
            } catch (err) {
                console.error(err);
            }
        }
    }

    fs.writeFileSync(
        managerFileName,
        generateManagerFile(name),
        { flag: "w" },
    );

    if (options.i) {
        fs.writeFileSync(
            managerIndexFileName,
            generateIndexBarrelFile(name),
            { flag: "w" },
        );

        generateFeatureIndexFile(name, Commands.manager, featureDirectory);
    }
}


function generateManagerFile(name: string) {
    const managerName = toPascalCase(name) + 'Manager';
    return [
        `class ${managerName} {`,
        `  const ${managerName}();`,
        `}`,
    ].join('\n');
}

function generateIndexBarrelFile(name: string) {
    const content = [
        `export './${name}_manager.dart';`,
    ];

    return content.join('\n');
}
