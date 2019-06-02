import createHistory from 'history/createBrowserHistory';

let history; // eslint-disable-line

if (typeof document !== 'undefined') {
  history = createHistory();
}

export default history;
