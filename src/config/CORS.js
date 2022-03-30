import { WHITELIST_DOAMAINS } from "../utilities/constants"

export const corsOptions = {
    origin: (origin, callback) => {
        if (WHITELIST_DOAMAINS.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error(`${origin} not allowed by CORS`))
        }
    },
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}