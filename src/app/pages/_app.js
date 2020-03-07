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
    await redirectIfNoLanguage(ctx)
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
