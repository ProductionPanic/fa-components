const esbuild = require('esbuild');
const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');

const config = {
    bundle: true,
    format: 'esm',
    minify: true,
    sourcemap: false,
    target: ['es2015'],
    external: [],
    define: {
        'process.env.NODE_ENV': '"production"',
    },
    treeShaking: true,
}

const entries = glob.sync('src/**/*.component.ts', { cwd: ROOT_DIR });

const build = async (entry) => {
    const name = path.basename(entry, '.component.ts');
    const outfile = path.resolve(DIST_DIR, `${name}.js`);
    const result = await esbuild.build({
        entryPoints: [path.resolve(ROOT_DIR, entry)],
        outfile,
        ...config
    });
    const { warnings } = result;
    if (warnings.length) {
        console.log(chalk.yellow(warnings));
    }
    console.log(chalk.green(`Built ${name} successfully`));
}

const buildAll = async () => {
    for (const entry of entries) {
        await build(entry);
    }
    // bundle all entries into a single file called all.js
    const outfile = path.resolve(DIST_DIR, 'all.js');
    const result = await esbuild.build({
        entryPoints: entries.map(entry => path.resolve(ROOT_DIR, entry)),
        outfile,
        ...config
    });
    const { warnings } = result;
    if (warnings.length) {
        console.log(chalk.yellow(warnings));
    }

    console.log(chalk.green(`Built all components successfully`));
}

const watch = async (cb = null) => {
    const watcher = chokidar.watch('src/**/*.component.ts', { cwd: ROOT_DIR });
    watcher.on('change', async (entry) => {
        await build(entry);
        if (cb) {
            cb(entry);
        }
    });
}

const main = async () => {
    if (fs.existsSync(DIST_DIR)) {
        fs.rmdirSync(DIST_DIR, { recursive: true });
    }
    fs.mkdirSync(DIST_DIR);

    const args = process.argv.slice(2);
    if (args.includes('--watch')) {
        await watch();
    } else {
        await buildAll();
    }
}

// if called directly from the command line
if (require.main === module) {
    main();
} else {
    module.exports = {
        build,
        buildAll,
        watch
    }
}

