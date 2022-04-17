import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import store from './app/store'
import { Provider } from 'react-redux'

import { worker } from './api/server'
import { fetchUsers } from './features/users/usersSlice'

import { apiSlice } from './features/api/apiSlice'

// Wrap app rendering so we can wait for the mock API to initialize
async function start() {
  // Start our mock API server
  await worker.start({ onUnhandledRequest: 'bypass' })

  // We only want to fetch the list of users once, and we want to do it right when the app starts.
  // This time we do the fetching with RTK query.
  store.dispatch(apiSlice.endpoints.getUsers.initiate())

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  )
}

start()
