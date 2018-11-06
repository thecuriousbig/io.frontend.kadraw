import React from 'react'
import ReactDOM from 'react-dom'

/* import CSS package */
import './index.css'
import 'semantic-ui-css/semantic.min.css'

/* Import react component */
import App from './App'

import * as serviceWorker from './serviceWorker'

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
