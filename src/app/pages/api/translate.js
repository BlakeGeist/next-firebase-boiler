const stringsModule = require("../../helpers/importStrings");

export default async (req, res) => {
    await stringsModule.handler(req, res);
};