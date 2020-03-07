export default (ctx) => {
    const headers = ctx.req.headers;
    const userRegionLang = headers["accept-language"].split(",")[0].split("-");
    const userLang = userRegionLang[0];
    const userRegion = userRegionLang[1].toLowerCase();
    if (ctx.res && ctx.asPath === "/") {
        console.log('this happened')
        console.log(`/${userLang}`)
        ctx.res.writeHead(301, { Location: `/${userLang}` });
        ctx.res.end();
    }
};