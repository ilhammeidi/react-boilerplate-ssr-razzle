import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import BrowserRouter from 'react-router-dom/BrowserRouter';
import LanguageProvider from "../containers/LanguageProvider";
import { translationMessages } from "../i18n";
import configureStore from "../redux/configureStore";
import App from "containers/App";

const store = configureStore(window.__PRELOADED_STATE__);
const MOUNT_NODE = document.getElementById("root");

const hydrate = messages => {
  ReactDOM.hydrate(
    <Provider store={store}>
      <LanguageProvider messages={messages}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LanguageProvider>
    </Provider>,
    document.getElementById("root")
  );
};

if (module.hot) {
  module.hot.accept("../containers/App", () => {
    ReactDOM.hydrate(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById("root")
    );
  });
}

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(["../i18n", "../containers/App"], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    hydrate(translationMessages);
  });
}

if (!window.Intl) {
  new Promise(resolve => {
    resolve(import("intl"));
  })
    .then(() =>
      Promise.all([
        import("intl/locale-data/jsonp/en.js")
      ])
    )
    .then(() => hydrate(translationMessages))
    .catch(err => {
      throw err;
    });
} else {
  hydrate(translationMessages);
}
