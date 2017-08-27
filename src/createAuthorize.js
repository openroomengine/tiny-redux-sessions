import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

const createAuthorize = (options) => {
  // Authorize component
  const mapStateToProps = (state, {roles}) => {
    const {user} = options.getSession(state)
    roles = roles instanceof Array ? roles : [roles]

    return {
      authorized: roles.includes(user.role),
    }
  }

  let Authorize = ({
    authorized,
    alwaysRender,
    children: child,
    // don't pass to child
    roles,
    dispatch,
    ...rest
  }) => {
    if (authorized) return React.cloneElement(child, rest)

    if (alwaysRender) return React.cloneElement(child, {unauthorized: true, ...rest})

    return null
  }
  Authorize = connect(mapStateToProps)(Authorize)
  Authorize.propTypes = {
    children: PropTypes.element.isRequired,
    roles: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    alwaysRender: PropTypes.bool,
  }

  // authorize decorator
  const authorize = (roles, alwaysRenderDec) => (Child) => {
    const AuthorizeDecorator = ({alwaysRender, ...rest}) =>
      <Authorize
        roles={roles}
        alwaysRender={alwaysRenderDec || alwaysRender}
      >
        <Child {...rest}/>
      </Authorize>

    return AuthorizeDecorator
  }

  return {
    authorize,
    Authorize,
  }
}

export default createAuthorize
