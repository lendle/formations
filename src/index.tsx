import "./bootstrap"
import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import App from "./components/App"
import * as serviceWorker from "./serviceWorker"
import CssBaseline from "@material-ui/core/CssBaseline"
import "typeface-roboto"
import { createMuiTheme } from "@material-ui/core"
import { ThemeProvider } from "@material-ui/styles"
import configureStore from "./store/configureStore"

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
})

const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
