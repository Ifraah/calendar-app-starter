import React from "react"
import { ConnectedRouter as Router } from "react-router-redux"
import Calendar from "./components/Calendar"
import { Provider } from "react-redux"
import storeWithHistory from "./store"
import "./App.css"

if (process.env.NODE_ENV === "production")
  window.Raven.config(process.env.REACT_APP_SENTRY_RAVEN_KEY).install()

export const FunctionalApp = () => {
  return (
    <div className="App">
        <Calendar />
      <footer className="footer" />
    </div>
  )
}

const { store, history } = storeWithHistory()

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
          <Router history={history}>
            <FunctionalApp />
          </Router>
      </Provider>
    )
  }
}

export default App
