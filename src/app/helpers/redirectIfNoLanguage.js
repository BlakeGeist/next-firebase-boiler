export default (ctx) => {
    const headers = ctx.req.headers;
    const userRegionLang = headers["accept-language"].split(",")[0].split("-");
    const userLang = userRegionLang[0];
    const userRegion = userRegionLang[1].toLowerCase();    
    if (ctx.res && ctx.asPath === '/') {
        ctx.res.writeHead(301, {
            Location: `/${userLang}`,
            // Add the content-type for SEO considerations
            'Content-Type': 'text/html; charset=utf-8',
        })
        ctx.res.end()
    }
}