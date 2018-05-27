import React from "react"
import { shallow, mount } from "enzyme"
import { ConnectedRouter as Router, push } from "react-router-redux"
import { Provider } from "react-redux"
import { setApolloError, setMockGraphQLResolvers } from "react-apollo"
import storeWithHistory from "./store"
import App, { FunctionalApp } from "./App"

describe("App", () => {
  beforeEach(() => {
    setMockGraphQLResolvers({
      ComplianceEntityUnion: () => ({
        __typename: "Facility",
      }),
    }) // the redirect triggers a GraphQL call from ContextualHeader, so we need to return data
  })

  it("loads the App div", () => {
    const component = shallow(<App />)
    expect(component.find("Provider")).toBePresent()
  })

  describe("Routing", () => {
    let store, history

    beforeEach(() => {
      const storeAndHistory = storeWithHistory()
      store = storeAndHistory.store
      history = storeAndHistory.history
    })

    const mountComponent = () => {
      return mount(
        <Provider store={store}>
          <Router history={history}>
            <FunctionalApp />
          </Router>
        </Provider>
      )
    }

    it("renders the overview", () => {
      store.dispatch(push("/facility/10/overview"))
      const component = mountComponent()
      expect(component.find("Overview")).toBePresent()
      expect(component.find("DetailView")).not.toBePresent()
    })

    it("renders the detail view when provided with a child entity", () => {
      store.dispatch(push("/facility/10/departments"))
      const component = mountComponent()
      expect(component.find("Overview")).not.toBePresent()
      expect(component.find("DetailView")).toBePresent()
    })

    it("renders the nested entity overview", () => {
      store.dispatch(push("/facility/10/department/51/overview"))
      const component = mountComponent()
      expect(component.find("Overview")).toBePresent()
    })

    it("renders a nested detail view", () => {
      store.dispatch(push("/facility/10/department/5/units"))
      const component = mountComponent()
      expect(component.find("Overview")).not.toBePresent()
      expect(component.find("DetailView")).toBePresent()
    })

    it("renders an entity detail view for rooms and staff", () => {
      store.dispatch(push("/facility/13/staff/420"))
      const component = mountComponent()
      expect(component.find("HistoryTable")).toBePresent()

      store.dispatch(push("/facility/13/room/420"))
      const component2 = mountComponent()
      expect(component2.find("HistoryTable")).toBePresent()

      store.dispatch(push("/facility/13/department/420"))
      const component3 = mountComponent()
      expect(component3.find("HistoryTable")).not.toBePresent()
    })

    it("renders a NotFound page for unknown routes", () => {
      let component
      const unknownRoutes = ["/bla", "/facility/7/overviewwww"]
      unknownRoutes.forEach(unknownRoute => {
        store.dispatch(push(unknownRoute))
        component = mountComponent()
        expect(component.find("NotFound")).toBePresent()
        expect(component.find("Overview")).not.toBePresent()
        expect(component.find("DetailView")).not.toBePresent()
      })
    })

    it("renders a dedicated error page", () => {
      global.console.error = jest.fn() // Swallow expected errors.
      setApolloError()
      store.dispatch(push("/error"))
      const component = mountComponent()
      expect(component.find("Header")).toBePresent()
      expect(component.find("ErrorReport")).toBePresent()
      expect(component.find("footer")).toBePresent()
    })

    it("redirects to overview page when given only an entityType and entityId", () => {
      store.dispatch(push("/facility/10"))
      mountComponent()
      expect(store.getState().router.location.pathname).toEqual(
        "/facility/10/overview"
      )
    })
  })
})
