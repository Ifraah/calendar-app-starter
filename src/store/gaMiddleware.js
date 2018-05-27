import ReactGA from "react-ga"

ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID, {
  testMode: process.env.NODE_ENV === "test",
  debug: process.env.REACT_APP_GA_DEBUG === "true",
})

const gaMiddleware = store => next => action => {
  try {
    if (
      action.type === "@@router/LOCATION_CHANGE" &&
      store.getState().router.location
    ) {
      const newRoute = `${action.payload.pathname}${action.payload.search}`
      const oldRoute = `${store.getState().router.location.pathname}${
        store.getState().router.location.search
      }`
      if (oldRoute !== newRoute) ReactGA.pageview(newRoute)
    }
  } catch (e) {
    /* istanbul ignore next */
    console.warn(`Error in gaMiddleware: ${e}`)
  } finally {
    next(action)
  }
}

export default gaMiddleware
