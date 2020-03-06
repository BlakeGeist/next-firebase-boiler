import axios from 'axios'
import absoluteUrl from './getAbsoluteUrl'
import nextCookie from 'next-cookies'

export default async (ctx) => {
    const { protocol, host } = absoluteUrl(ctx.req)
    const apiURL = `${protocol}//${host}`
    const { token2 } = nextCookie(ctx)
    const getUserResponse = await axios.post(`${apiURL}/api/getUserFromToken`, {token: token2})
    const user = getUserResponse.data.user;
    (user) ? ctx.reduxStore.dispatch({ type: "SET_ITEM", name: "user", payload: user }) : "";
    (user) ? ctx.reduxStore.dispatch({ type: "SET_ITEM", name: "isLoggedIn", payload: true }) : "";
}