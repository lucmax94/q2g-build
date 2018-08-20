import { existsSync } from "fs";
import { resolve } from "path";
import { Plugin } from "webpack";
import { IBuilderEnvironment } from "../../api";
import { IDataNode } from "../../api/data-node";
import { WebpackBuilder } from "../webpack-builder";
import { CopyWebpackPlugin, PathOverridePlugin, QextFilePlugin, ZipWebpackPlugin } from "./plugins";
import { ExtensionService } from "./service/extension.service";

/**
 * Builder for Qlick 2 Go Extensions
 *
 * @export
 * @class ExtensionBuilder
 * @extends {WebpackBuilder}
 */
export class ExtensionBuilder extends WebpackBuilder {

    private extensionService: ExtensionService;

    public constructor() {
        super();
        this.extensionService = new ExtensionService();
    }

    /**
     *
     * @inheritDoc
     * @param {IBuilderEnvironment} env
     * @memberof ExtensionBuilder
     */
    public initialize(env: IBuilderEnvironment) {

        super.initialize(env);

        this.webpackService.getConfig().setExternalModules([
            { angular  : "angular"},
            { qlik     : "qlik" },
            { qvangular: "qvangular"},
        ]);
    }

    protected getInitialConfig(env: IBuilderEnvironment): IDataNode {
        const initialConfig = super.getInitialConfig(env);
        initialConfig.entryFile = `./${env.projectName}.ts`;
        return initialConfig;
    }

    /**
     * webpack build process has completed without errors
     *
     * @override
     * @protected
     * @memberof ExtensionBuilder
     */
    protected async completed() {
        process.stdout.write("extension successfully created.");
    }

    /**
     * @inheritDoc
     * @protected
     * @returns {Plugin[]}
     * @memberof WebpackBuilder
     */
    protected loadWebpackPlugins(): Plugin[] {

        const plugins  = super.loadWebpackPlugins();
        const fileName = this.webpackService.getConfig().getOutFileName();
        const outDir   = this.webpackService.getConfig().getOutDirectory();

        return plugins.concat([
            new PathOverridePlugin(/\/umd\//, "/esm/"),
            new CopyWebpackPlugin(this.getBinaryFiles()),
            new QextFilePlugin(
                this.extensionService.getQextConfiguration()),
            new ZipWebpackPlugin({
                filename: `${fileName}.zip`,
                path: outDir,
            }),
        ]);
    }

    /**
     * get binary files which should copy to dist folder
     *
     * @private
     * @returns {IDataNode[]}
     * @memberof ExtensionBuilder
     */
    private getBinaryFiles(): IDataNode[] {

        const binFiles = [
            { from: "wbfolder.wbl" , to: "wbfolder.wbl" },
        ];

        if ( existsSync( resolve(this.webpackService.getConfig().getProjectRoot(), "preview.png") )) {
            binFiles.push({from: "preview.png", to: "preview.png" });
        }

        return binFiles;
    }
}
