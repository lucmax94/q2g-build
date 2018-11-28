import { Extension } from "../service/extension";
import { Webpack } from "../service/webpack";

const enum InitType {
    EXTENSION = "extension",
    WEBPACK   = "webpack",
}

export function initCommand(type: string) {

    let initService;

    switch (type) {
        case InitType.EXTENSION:
            // initialize InitExtensionService
            initService = new Extension();
            break;
        case InitType.WEBPACK:
            initService = new Webpack();
            break;
        default:
            process.stderr.write("invalid argument for init, call with --init <extension|webpack>");
            process.exit(1);
    }

    return initService.run();
}
