# Riverpod CLI [![Actions Status][gh-actions-badge]][gh-actions] [![Node Version][node-badge]][npm] [![NPM version][npm-badge]][npm]

The Riverpod Command Line Interface (CLI) Tools is created for skipping the boilerplate files generation when using riverpod plugin - https://riverpod.dev.

- You can easily create services
- You can easily create repositories
- You can easily create managers
- You can easily create features, which includes all of the above

## Installation

### Node Package

You can install the Riverpod CLI using npm (the Node Package Manager).
Note that you will need to install:
- [Node.js] http://nodejs.org/
- [npm] https://npmjs.org/

To download and install the Riverpod CLI run the following command:

```bash
npm install -g riverpod-cli
```

## Commands

**The command `riverpod-cli --help` lists the available commands and `riverpod-cli <command> --help` shows more details for an individual command.**

Use this cli inside you flutter projects directory!!!


### Configuration Commands

First four commands need a required parameter, which is a feature name.

| Command        | Description                                                                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **service**    | Create a service with a given name.                                                                                                             |
| **repository** | Create a repository with a given name.                                                                                                          |
| **manager**    | Create a manager with a given name.                                                                                                             |
| **feature**    | Create a whole feature with a given name, this includes services, repositories and managers.                                                    |
| **help**       | Display help information about.                                                                                                                 |


### Common args

| Parameter           |                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **-t**              | Default features directory is /lib/features, but with this flag you can set the different directory                                        |
| **-i**              | With this flag the CLI generates index barrel files.                                                                                       |
| **--use-imports**   | By default, CLI uses `absolute` imports. Set this parameter to `relative`, in order to use relatice imports.                               |


### Specific args per command type

| Parameter      | Description                                                                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **service**    |                                                                                                                                                 |
| **-l**         | Creates a local service class.                                                                                                                  |
| **-r**         | Creates a remote service class.                                                                                                                 |
|                |                                                                                                                                                 |
| **feature**    | Create a whole feature with a given name, this includes services, repositories and managers.                                                    |
| **-p**         | This parameter creates a providers file inside the feature folder.                                                                              |


### Folders structure

```bash
/lib 
    /features/
        /managers/
            -> example_manager.dart
            -> managers.dart (index barrel file)
        /services/
            -> example_service.dart (abstract interface)
            -> example_local_service.dart
            -> example_remote_service.dart
            -> services.dart (index barrel file)
        /repostiories/
            -> example_repository.dart (abstract interface)
            -> example_repository_impl.dart
            -> repositories.dart (index barrel file)
        -> example.dart (feature index barrel file)
        -> providers.dart (feature provider file)
```

You can create mentioned files and folders with `riverpod-cli feature` command.