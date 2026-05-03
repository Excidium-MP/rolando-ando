const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

// Monorepo support: Metro must watch the workspace root and resolve packages
// from both the local node_modules and the hoisted root node_modules.
// See https://docs.expo.dev/guides/monorepos/
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Note: do NOT set `disableHierarchicalLookup` for npm workspaces. That flag
// is for pnpm (with its strict, content-addressed store). With npm hoisting,
// some packages keep nested node_modules (e.g. react-native-reanimated nests
// its own semver), and Metro must walk up to find them.

module.exports = withNativeWind(config, { input: './global.css' });
