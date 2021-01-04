# z/OS TSO Zowe CLI SDK and IBM RSE API example

This example shows how to use the Zowe CLI TSE SDK and the IBM RSE API alternatively to run TSO commands. It extends the example provided here for the Zowe CLI TSO SDK: <https://github.com/zowe/zowe-cli/tree/master/packages/zostso>

## How to build

- Install the IBM RSE API client NPM package
- Edit the package.json file to point to the location of your installation
- Build with yarn or npm

```bash
yarn
```

## How to run

```bash
yarn run-zosmf
```

or

```bash
yarn run-rse
```

## Known issues

Dependency management is problematic with the latest TSO SDK package, because some deprecated methods were removed with Zowe CLI 6.25. See the CLI code itself, which still also refers back to Imperative v4.8.1: <https://github.com/zowe/zowe-cli/blob/master/packages/zostso/package.json>

The IBM RSE API v1.1.2 is build against Imperative 4.8.1 and Zowe CLI 6.22 at the moment. So mixing the different versions could lead to some issues.
