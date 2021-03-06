import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { createComment } from '../../../api/comments'
import { createCommentFailure } from '../../AutoDismissAlert/messages'
import { v4 as uuid } from 'uuid'

import Form from 'react-bootstrap/Form'

import './CreateComment.scss'

class CreateComment extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ownerName: props.user.username,
      content: '',
      created: false
    }
  }

  componentDidMount () {
    this.setState({ _id: uuid() })
  }

  handleChange = (event) =>
    this.setState({
      [event.target.name]: event.target.value
    })

  onCreateComment = (event) => {
    event.preventDefault()
    const timestamp = Date.now()
    this.setState({ createdAt: timestamp }, () => {
      const { msgAlert, user, logId, updateComments, showComments, toggleComments } = this.props
      const { content, _id, timestamp } = this.state

      createComment(this.state, user, logId)
        .then(() =>
          updateComments({
            ownerName: user.username,
            owner: user._id,
            content,
            _id,
            createdAt: timestamp
          })
        )
        .then(() => { if (!showComments) toggleComments() })
        .then(() => { this.setState({ content: '' }) })
        .catch((err) => {
          msgAlert({
            heading: 'Couldn\'t Create Comment',
            message: createCommentFailure + err.message,
            variant: 'danger'
          })
        })
        .finally(() => {
          this.setState({ _id: uuid() })
        })
    })
  }

  render () {
    const { content } = this.state

    return (
      <>
        <Form className="log" onSubmit={this.onCreateComment}>
          <Form.Group>
            <Form.Control
              required
              autoComplete="off"
              className="log commentInput"
              name='content'
              value={content}
              placeholder='Add Comment'
              onChange={this.handleChange}
            />
          </Form.Group>
        </Form>
      </>
    )
  }
}

export default withRouter(CreateComment)
