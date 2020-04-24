import axios from 'axios'
import absoluteUrl from './_getAbsoluteUrl'
import nextCookie from 'next-cookies'
import cookie from 'js-cookie'

export default async (ctx) => {
    const { apiURL } = absoluteUrl(ctx.req)
    const { token2 } = nextCookie(ctx)
    const getUserResponse = await axios.post(`${apiURL}/api/getUserFromToken`, {token: token2})
    const user = getUserResponse.data.user;
    (user) ? ctx.reduxStore.dispatch({ type: "SET_ITEM", name: "user", payload: user }) : cookie.remove('token2');
    (user) ? ctx.reduxStore.dispatch({ type: "SET_ITEM", name: "isLoggedIn", payload: true }) : "";
}
