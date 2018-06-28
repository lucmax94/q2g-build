import { dirname, resolve } from "path";
import { Config, IDataNode, Log } from "rh-utils";
import { IBuilder } from "./api";
import { AppConfigProperties } from "./model/data/app.config";
import { CommandlineOptions } from "./model/data/commandline.options";
import { BuilderService, OptionHelper } from "./services";

const logService     = Log.getInstance();
const configService  = Config.getInstance();
const builderService = BuilderService.getInstance();
const logPath = resolve( dirname(__filename), "..");

Log.configure({
    LogModule: {
        paths: {
            debug: `${logPath}/log/debug.log`,
            error: `${logPath}/log/error.log`,
        },
    },
});

/**
 * initialize builder app configuration
 *
 * @param {string} root
 */
function initAppConfiguration(root: string) {

    /** create base configuration values */
    configService.set(AppConfigProperties.appRoot, `${root}/bin`);
    configService.set(AppConfigProperties.root, root);
    configService.set(AppConfigProperties.sourceRoot , process.cwd());

    const pkgJsonData = OptionHelper.loadFromFile(`${process.cwd()}/package.json`);
    configService.set(AppConfigProperties.packageName, pkgJsonData.name );
}

/**
 * entry point builder
 *
 * @param {string} scriptPath
 * @param {...string[]} args additional command line arguments
 */
function main(scriptPath: string, ...args: string[]) {

    const options: IDataNode = OptionHelper.convertCommandlineArguments(args);
    const errors: string[]   = OptionHelper.validateOptions(options, CommandlineOptions);

    if ( errors.length ) {
        process.stderr.write(errors.join("\n"));
        process.exit(1);
    }

    try {
        initAppConfiguration(scriptPath);

        const builder: IBuilder = builderService.getBuilder(options.builder);
        let config = {};

        if ( options.hasOwnProperty("config") && options.config ) {
            const configFile = resolve(process.cwd(), options.config);
            config = OptionHelper.loadFromFile(configFile);
        }

        const builderConfig = Object.assign({
            environment: options.env || "development",
        }, config);

        builder.configure( builderConfig );
        builder.run();
    } catch ( err ) {
        logService.log(`${err}`, Log.LOG_ERROR);
    }
}
/**
 * call main method and pass process arguments, remove first argument
 * since this is only the node excecution file path
 */
main.apply(this, process.argv.slice(1));
