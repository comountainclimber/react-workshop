////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// Write a <ListView> that only shows the elements in the view.
//
// Got extra time?
//
// - Render fewer rows as the size of the window changes (Hint: Listen
//   for the window's "resize" event)
// - Try rendering a few rows above and beneath the visible area to
//   prevent tearing when scrolling quickly
// - Remember scroll position when you refresh the page
////////////////////////////////////////////////////////////////////////////////
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import * as RainbowListDelegate from './utils/RainbowListDelegate'
import './styles'


// we know the number of rows, and their height.

class RainbowList extends React.Component {
  static propTypes = {
    numRows: PropTypes.number.isRequired,
    rowHeight: PropTypes.number.isRequired,
    renderRowAtIndex: PropTypes.func.isRequired
  }

  state = {
    scrollPosition: 0
  }

  render() {
    const windowHeight = window.innerHeight
    const { scrollPosition } = this.state
    const { numRows, rowHeight, renderRowAtIndex } = this.props
    const totalHeight = numRows * rowHeight

    const items = []

    const rowsPerScreen = Math.ceil(windowHeight / rowHeight)
    const startingIndex = Math.floor(scrollPosition / rowHeight)

    const padding = startingIndex * rowHeight
    const endingIndex = startingIndex + rowsPerScreen

    let index = startingIndex
    while (index < endingIndex) {
      items.push(<li key={index}>{renderRowAtIndex(index)}</li>)
      index++
    }

    return (
      <div onScroll={(e) => this.setState({scrollPosition: e.target.scrollTop})} style={{ height: '100%', overflowY: 'scroll' }}>
        <ol style={{ height: totalHeight, paddingTop: padding }}>
          {items}
        </ol>
      </div>
    )
  }
}

ReactDOM.render(
  <RainbowList
    numRows={500000000000}
    rowHeight={RainbowListDelegate.rowHeight}
    renderRowAtIndex={RainbowListDelegate.renderRowAtIndex}
  />,
  document.getElementById('app')
)
