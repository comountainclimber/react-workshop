////////////////////////////////////////////////////////////////////////////////
import React from 'react'
import PropTypes from 'prop-types'
import { createHashHistory } from 'history'

/*
// read the current URL
history.location

// listen for changes to the URL
history.listen(() => {
  history.location // is now different
})

// change the URL
history.push('/something')
*/

class Router extends React.Component {
  history = createHashHistory()
  listener = this.history.listen((history) => {
    this.history.location.pathname = history.pathname
    this.forceUpdate()
  })

  static childContextTypes = {
    history: PropTypes.object.isRequired
  }

  getChildContext() {
    return {
      history: this.history
    }
  }

  render() {
    return this.props.children
  }
}

class Route extends React.Component {
  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  render() {
    const { path, render, component: Component } = this.props
    const { history } = this.context
    if (history.location.pathname === path && render) return render({ history })
    if (history.location.pathname === path && this.props.component) return <Component history={history}/>
    return null
  }
}

class Link extends React.Component {
  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  handleClick = (e) => {
    e.preventDefault()
    this.context.history.push(this.props.to)
  }
  render() {
    return (
      <a
        href={`#${this.props.to}`}
        onClick={this.handleClick}
      >
        {this.props.children}
      </a>
    )
  }
}

const withRouter = (Comp) => (props) => (
  <Route path="/" render={(routerProps) => <Comp {...props} {...routerProps}/>}/>
)

export { Router, Route, Link }
