const stringsModule = require('../../helpers/_importStrings')

export default async (req, res) => {
    await stringsModule.handler(req, res);
}