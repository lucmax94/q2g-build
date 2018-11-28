import { ICommandLineBuilderData } from "../../api/cmdline-observer";
import { Namespaces } from "../../api/namespaces";

/**
 * required properties for qext file which will be generated
 * from package.json file
 */
export const QextProperties: ICommandLineBuilderData = {
    data: [
        {
            name: "icon",
            text: "filename for extension icon",
            validator: (value) => {
                return true;
            },
        },
        {
            name: "type",
            text: "extension type",
            validator: (value) => {
                return true;
            },
        },
        {
            name: "id",
            text: "extension id",
            validator: (value) => {
                return true;
            },
        },
    ],
    namespace: Namespaces.QEXT,
};

export default QextProperties;
