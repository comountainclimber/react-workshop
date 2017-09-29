////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// - Refactor App by creating a new component named `<GeoPosition>`
// - <GeoPosition> should use a child render callback that passes
//   to <App> the latitude and longitude state
// - When you're done, <App> should no longer have anything but
//   a render method
//
// Got extra time?
//
// - Now create a <GeoAddress> component that also uses a render
//   callback with the current address. You will use
//   `getAddressFromCoords(latitude, longitude)` to get the
//   address, it returns a promise.
// - You should be able to compose <GeoPosition> and <GeoAddress>
//   beneath it to naturally compose both the UI and the state
//   needed to render it
// - Make sure <GeoAddress> supports the user moving positions
////////////////////////////////////////////////////////////////////////////////
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import LoadingDots from './utils/LoadingDots'
import getAddressFromCoords from './utils/getAddressFromCoords'

class GeoPosition extends React.Component {
  state = {
    coords: {
      latitude: null,
      longitude: null
    },
    error: null
  }

  componentDidMount() {
    this.geoId = navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        })
      },
      (error) => {
        this.setState({ error })
      }
    )
  }

  render() {
    return this.props.render(this.state)
  }
}

class GeoAddress extends React.Component {
  state = {
    address: ''
  }

  componentDidMount() {
    this.getAddress(this.props.latitude, this.props.longitude)
  }

  componentDidUpdate(nextProps) {
    if (nextProps.latitude !== this.props.latitude) {
      return this.getAddress(nextProps.latitude, nextProps.longitude)
    }
  }

  getAddress(lat, long) {
      return getAddressFromCoords(lat, long)
        .then(address => this.setState({ address: address }))
        .catch(error => this.setState({ error }))
  }

  render() {
    return this.props.render(this.state)
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Geolocation</h1>
        <GeoPosition render={(state) =>
          state.error ? (
            <div>Error: state.error.message}</div>
          ) : (
            state.coords.latitude ? 
              <GeoAddress 
                latitude={state.coords.latitude}
                longitude={state.coords.longitude}
                render={
                  ({ address }) => {
                    console.log(address)
                    return (
                      <dl>
                        <div> Your coordinates were found! {<pre> {JSON.stringify(state.coords)} </pre>} </div>
                        Address:
                          {
                              <dd>
                                {address || <LoadingDots/>}
                              </dd>
                          } 
                      </dl>
                    )
                  }
                }
              /> : <div> We are closing in on your location<LoadingDots/> </div>
          )}
        />
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
