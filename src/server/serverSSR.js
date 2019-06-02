import React from 'react';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import { renderToString } from 'react-dom/server';
import serialize from 'serialize-javascript'; // Safer stringify, prevents XSS attacks
import LanguageProvider from 'containers/LanguageProvider';
import configureStore from '../redux/configureStore';
import { translationMessages } from '../i18n';
import App from '../containers/App';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const store = configureStore()
    const context = {};
    const markup = renderToString(
      <Provider store={store}>
        <LanguageProvider messages={translationMessages}>
          <StaticRouter context={context} location={req.url}>
            <App />
          </StaticRouter>
        </LanguageProvider>
      </Provider>
    );

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(
        `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ''
        }
    </head>
    <body>
        <h1>This is SSR mode Coy</h1>
        <div id="root">${markup}</div>
        ${
          process.env.NODE_ENV === 'production'
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
    </body>
</html>`
      );
    }
  });

export default server;
