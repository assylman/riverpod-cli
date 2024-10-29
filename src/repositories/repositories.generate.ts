import fs from 'fs';
import { Commands, formattingTarget, toPascalCase } from "../utils";
import { generateFeatureIndexFile } from '../features';

const repositoryDart = '_repository.dart';
const indexDart = 'repositories.dart';

export function generateRepository(name: string, options: any) {
    const target = options.target;

    const libDir = target != null ? formattingTarget(target) : '/lib/features';

    const featureDirectory = '.' + libDir + '/' + name;
    const repositoryDirectory = featureDirectory + '/repositories';
    const repositoryAbstractFileName = repositoryDirectory + '/' + name + repositoryDart;
    const repositoryImplFileName = repositoryDirectory + '/' + name + '_repository_impl.dart';
    const repositoryIndexFileName = repositoryDirectory + '/' + indexDart;

    const dirs = repositoryDirectory.split('/').filter(n => n && n != 'lib');
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
        repositoryAbstractFileName,
        generateAbstractInterface(name),
        { flag: "w" },
    );

    fs.writeFileSync(
        repositoryImplFileName,
        generateImplClass(name, options, libDir),
        { flag: "w" },
    );


    if (options.i) {
        fs.writeFileSync(
            repositoryIndexFileName,
            generateIndexBarrelFile(name, options, libDir),
            { flag: "w" },
        );

        generateFeatureIndexFile(name, Commands.repository, featureDirectory);
    }
}


function generateAbstractInterface(name: string) {
    return [
        `abstract interface class ${toPascalCase(name) + 'Repository'} {`,
        `   /// Your abstract methods goes here`,
        `}`,
    ].join('\n');
}

function generateImplClass(name: string, options: any, libDir: string) {
    const repositoryName = toPascalCase(name);
    const repositoryFileName = name + repositoryDart;
    const repositoryImplName = repositoryName + 'RepositoryImpl';

    const useAbsoluteImports = options.useAbsoluteImports;
    var importName = useAbsoluteImports ? `import 'package:${options.packageName}${libDir}/${name}/repositories/${repositoryFileName}';` : `import './${repositoryFileName}';`;


    if (options.i) {
        importName = useAbsoluteImports ? `import 'package:${options.packageName}${libDir}/${name}/repositories/${indexDart}';` : `import './${indexDart}';`;
    }

    return [
        `${importName}`,
        ``,
        `class ${repositoryImplName} implements ${repositoryName}Repository {`,
        `   const ${repositoryImplName}();`,
        `   /// Your override methods goes here`,
        `}`,
    ].join('\n');
}


function generateIndexBarrelFile(name: string, options: any, libDir: string) {
    const repositoryFileName = name + repositoryDart;

    const useAbsoluteImports = options.useAbsoluteImports;

    const exportRepositoryName = useAbsoluteImports ? `export 'package:${options.packageName}${libDir}/${name}/repositories/${repositoryFileName}';` : `export './${repositoryFileName}';`;
    const exportImplName = useAbsoluteImports ? `export 'package:${options.packageName}${libDir}/${name}/repositories/${name}_repository_impl.dart';` : `export './${name}_repository_impl.dart';`;

    const content = [
        `${exportRepositoryName}`,
        `${exportImplName}`,
    ];

    return content.join('\n');
}