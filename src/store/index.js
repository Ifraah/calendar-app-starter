import { createStore, combineReducers, applyMiddleware, compose } from "redux"
import moment from "moment"
import createHistory from "history/createBrowserHistory"
import { routerReducer, routerMiddleware } from "react-router-redux"
import gaMiddleware from "./gaMiddleware"

const initialState = {
  startDate: moment()
    .subtract(30, "days")
    .toJSON(),
  endDate: moment()
    .subtract(1, "days")
    .toJSON(),
}

export const dateRangeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_DATE_RANGE":
      return { ...state, startDate: action.startDate, endDate: action.endDate }
    default:
      return state
  }
}

// action creator
export const updateDateRange = (startDate, endDate) => {
  return {
    type: "UPDATE_DATE_RANGE",
    startDate: startDate.toJSON(),
    endDate: endDate.toJSON(),
  }
}

const storeWithHistory = () => {
  const history = createHistory()
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  return {
    store: createStore(
      combineReducers({
        dateRange: dateRangeReducer,
        router: routerReducer,
      }),
      composeEnhancers(applyMiddleware(routerMiddleware(history), gaMiddleware))
    ),
    history: history,
  }
}

export default storeWithHistory
