import React from "react";
import withReduxStore from "../lib/reducers";
import { Provider } from "react-redux";
import setUserState from "../helpers/setUserState";
import redirectIfNoLanguage from "../helpers/redirectIfNoLanguage";
import getPageStrings from "../helpers/getPageStrings";
import getGlobalStrings from "../helpers/getGlobalStrings";

const MyApp = ({ Component, pageProps, reduxStore }) => {
    return (
        <Provider store={reduxStore}>
            <Component {...pageProps} />
        </Provider>
    );
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
    const headers = ctx.req.headers;
    const userRegionLang = headers["accept-language"].split(",")[0].split("-");
    const userLang = userRegionLang[0];
    const userRegion = userRegionLang[1].toLowerCase();
    const { protocol, host } = absoluteUrl(ctx.req);
    const apiURL = `${protocol}//${host}`;

    if (ctx.res && ctx.asPath === "/") {
        console.log('this happened')
        console.log(`${apiURL}/${userLang}`)
        ctx.res.writeHead(301, {
            'Location': `${apiURL}/${userLang}`
            //add other headers here...
          });
        ctx.res.end();
        return
    }

    if (ctx.req){
        await setUserState(ctx);
    }
    await getPageStrings(ctx);
    await getGlobalStrings(ctx);
    ctx.reduxStore.dispatch({ type: "SET_ITEM", name: "lang", payload: ctx.query.lang });    
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    return { pageProps };
};

export default withReduxStore(MyApp);
