////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Make `withMouse` a "higher-order component" that sends the mouse position
// to the component as props.
//
// Hint: use `event.clientX` and `event.clientY`
//
// Got extra time?
//
// Make a `withCat` HOC that shows a cat chasing the mouse around the screen!
////////////////////////////////////////////////////////////////////////////////
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import * as styles from './styles'

const withCat = (C) => {

    class ContainingCat extends React.Component {
      render() {
        const { mouse } = this.props
        return (
          <div>
            <img
              style={{
                position: 'absolute',
                top: 20 + mouse.y,
                left: 20 + mouse.x
              }}
              src="https://pbs.twimg.com/profile_images/742621666027569152/m345-jkv_400x400.jpg"
            />
            <C {...this.props}/>
          </div>

        )
      }
    }
    return ContainingCat;
}

const withMouse = (C) => {
  class ContainingMouse extends React.Component {
      state = {
        x: 0,
        y: 0
      }

      handleMouseMove(e) {
        console.log(e)
        this.setState({
          x: e.clientX,
          y: e.clientY
        })
      }

      render() {
        return (
          <div onMouseMove={(e) => this.handleMouseMove(e)}>
            <C mouse={this.state} />
          </div>
        )
      }
  }
  return ContainingMouse;
}

class App extends React.Component {
  static propTypes = {
    mouse: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }).isRequired
  }

  render() {
    const { mouse } = this.props

    return (
      <div style={styles.container}>
        {mouse ? (
          <h1>The mouse position is ({mouse.x}, {mouse.y})</h1>
        ) : (
          <h1>We don't know the mouse position yet :(</h1>
        )}
      </div>
    )
  }
}

const AppWithMouse = withMouse(withCat(App))

ReactDOM.render(<AppWithMouse/>, document.getElementById('app'))
