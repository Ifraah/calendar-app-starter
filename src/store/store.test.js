import React from "react"
import ReactGA from "react-ga"
import { dateRangeReducer, updateDateRange } from "."
import { mount } from "enzyme"
import { ConnectedRouter as Router, push } from "react-router-redux"
import { Provider } from "react-redux"
import storeWithHistory from "."
import moment from "moment"

describe("store", () => {
  test("updateDateRange", () => {
    const start = moment(1)
    const end = moment(2)
    const state = dateRangeReducer({ foo: "bar" }, updateDateRange(start, end))
    expect(state.foo).toEqual("bar")
    expect(state.startDate).toEqual(start.toJSON())
    expect(state.endDate).toEqual(end.toJSON())
  })

  describe("gaMiddleware", () => {
    it("records only unique route changes", () => {
      const { store, history } = storeWithHistory()
      mount(
        <Provider store={store}>
          <Router history={history} />
        </Provider>
      )
      const calls = ReactGA.testModeAPI.calls.length
      store.dispatch(push("/foo"))
      expect(ReactGA.testModeAPI.calls.length).toEqual(calls + 1)
      store.dispatch(push("/foo"))
      expect(ReactGA.testModeAPI.calls.length).toEqual(calls + 1)
    })
  })
})
