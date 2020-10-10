import React, { useEffect, useState } from 'react'
import createReactContext from 'create-react-context'
import { Hub, Auth } from 'aws-amplify'
const UserContext = createReactContext()

const AUTHENTICATOR_AUTHSTATE = 'amplify-authenticator-authState'

const UserContextProvider = props => {

  const [auth, setAuth] = useState({})
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        localStorage.setItem(AUTHENTICATOR_AUTHSTATE, 'signedIn')
        setAuth({ state: 'signIn', user: user.username })
      })
      .catch(err => {
        //console.log(err)
        localStorage.getItem(AUTHENTICATOR_AUTHSTATE)})
      .then(cachedAuthState => cachedAuthState === 'signedIn' && Auth.signOut())
  }, [])
  useEffect(() => {
    Hub.listen('auth', ({ payload }) => {
      const { event, data } = payload
      if (event === 'signOut') {
        setAuth({ state: event, user: null })
        //localStorage.deleteItem(AUTHENTICATOR_AUTHSTATE)
        return
      }
      if(event !== 'signUp'){
        localStorage.setItem(AUTHENTICATOR_AUTHSTATE, 'signedIn')
        setAuth({ state: event, user: data.username})
      }
    })
  }, [])

  return <UserContext.Provider value={auth}>{props.children}</UserContext.Provider>
}

export { UserContext, UserContextProvider, }