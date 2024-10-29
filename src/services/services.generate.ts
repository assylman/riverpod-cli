import fs from 'fs';
import { Commands, formattingTarget, toPascalCase } from "../utils";
import { generateFeatureIndexFile } from '../features';
import { generateProvider } from '../providers';

const serviceDart = '_service.dart';
const indexDart = 'services.dart';

export function generateService(name: string, options: any) {
    const target = options.target;
    const libDir = target != null ? formattingTarget(target) : '/lib/features';

    const featureDirectory = '.' + libDir + '/' + name;
    const serviceDirectory = featureDirectory + '/services';
    const serviceAbstractFileName = serviceDirectory + '/' + name + serviceDart;
    const serviceIndexFileName = serviceDirectory + '/' + indexDart;

    const dirs = serviceDirectory.split('/').filter(n => n && n != 'lib');
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
        serviceAbstractFileName,
        generateAbstractInterface(name),
        { flag: "w" },
    );

    if (options.l) {
        const localServiceFileName = serviceDirectory + '/' + name + '_local' + serviceDart;
        fs.writeFileSync(
            localServiceFileName,
            generateLocalClass(name, options, libDir),
            { flag: "w" },
        );

    }

    if (options.r) {
        const remoteServiceFileName = serviceDirectory + '/' + name + '_remote' + serviceDart;
        fs.writeFileSync(
            remoteServiceFileName,
            generateRemoteClass(name, options, libDir),
            { flag: "w" },
        );
    }

    if (options.i) {
        fs.writeFileSync(
            serviceIndexFileName,
            generateIndexBarrelFile(name, options, libDir),
            { flag: "w" },
        );

        generateFeatureIndexFile(name, Commands.service, featureDirectory);
    }

    if (options.p) {
        generateProvider(name, options, Commands.service);
    }
}


function generateAbstractInterface(name: string) {
    return [
        `abstract interface class ${toPascalCase(name) + 'Service'} {`,
        `   /// Your abstract methods goes here`,
        `}`,
    ].join('\n');
}

function generateLocalClass(name: string, options: any, libDir: string) {
    const serviceName = toPascalCase(name);
    const serviceFileName = name + serviceDart;
    const serviceImplName = serviceName + 'LocalService';

    const useAbsoluteImports = options.useAbsoluteImports;
    var importName = useAbsoluteImports ? `import 'package:${options.packageName}${libDir}/${name}/services/${serviceFileName}';` : `import './${serviceFileName}';`;


    if (options.i) {
        importName = useAbsoluteImports ? `import 'package:${options.packageName}${libDir}/${name}/services/${indexDart}';` : `import './${indexDart}';`;
    }

    return [
        `${importName}`,
        ``,
        `class ${serviceImplName} implements ${serviceName}Service {`,
        `   const ${serviceImplName}();`,
        ``,
        `   /// Your override methods goes here`,
        `}`,
    ].join('\n');
}

function generateRemoteClass(name: string, options: any, libDir: string) {
    const serviceName = toPascalCase(name);
    const serviceFileName = name + serviceDart;
    const serviceImplName = serviceName + 'RemoteService';

    const useAbsoluteImports = options.useAbsoluteImports;
    var importName = useAbsoluteImports ? `import 'package:${options.packageName}${libDir}/${name}/services/${serviceFileName}';` : `import './${serviceFileName}';`;

    if (options.i) {
        importName = useAbsoluteImports ? `import 'package:${options.packageName}${libDir}/${name}/services/${indexDart}';` : `import './${indexDart}';`;
    }

    return [
        `${importName}`,
        ``,
        `class ${serviceImplName} implements ${serviceName}Service {`,
        `   const ${serviceImplName}();`,
        ``,
        `   /// Your override methods goes here`,
        `}`,
    ].join('\n');
}

function generateIndexBarrelFile(name: string, options: any, libDir: string) {
    const serviceFileName = name + serviceDart;

    const useAbsoluteImports = options.useAbsoluteImports;

    const exportServiceName = useAbsoluteImports ? `export 'package:${options.packageName}${libDir}/${name}/services/${serviceFileName}';` : `export './${name}${serviceDart}';`;
    const exportLocalServiceName = useAbsoluteImports ? `export 'package:${options.packageName}${libDir}/${name}/services/${name}_local_service.dart';` : `export './${name}_local_service.dart';`;
    const exportRemoteServiceName = useAbsoluteImports ? `export 'package:${options.packageName}${libDir}/${name}/services/${name}_remote_service.dart';` : `export './${name}_remote_service.dart';`;

    const content = [
        exportServiceName,
    ];

    if (options.l) {
        content.push(exportLocalServiceName);
    }

    if (options.r) {
        content.push(exportRemoteServiceName);
    }

    return content.join('\n');
}