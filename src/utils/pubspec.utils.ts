import fs from 'fs';
import os from 'os';
import { Imports } from '.';


export function getInformationFromPubspec(name: string, options: any) {
    const pubspecFile = './pubspec.yaml';
    const data = fs.readFileSync(pubspecFile, { encoding: 'utf-8' });
    const splittedData = data.split(os.EOL);

    const useImports = options.useImports ?? Imports.relative;

    const info: { [key: string]: any; } = {};

    if (useImports.includes(Imports.absolute)) {
        info['useAbsoluteImports'] = true;

        if (!splittedData[0]) {
            /// throw an error if options flag is -i, but we cannot find packageName inside pubspec.yaml file
            throw Error('Using absolute imports, can\'t find a package name inside your pubspec.yaml file');
        }

        const pkgName = splittedData[0]!.replaceAll('name: ', '');

        info['packageName'] = pkgName;
    } else {
        info['useAbsoluteImports'] = false;
    }

    return info;
}