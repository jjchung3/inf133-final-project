import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import FilledInput from '@material-ui/core/FilledInput'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Typography from '@material-ui/core/Typography'
import { LOGIN, SIGNUP } from '../queries/queries'
import { Redirect } from 'react-router-dom'

const useStyles = makeStyles(() => ({
  container: {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#0F202D',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    minHeight: '350px',
    width: '30vw',
    height: '50vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  textField: {
    width: '40ch',
    marginBottom: '2ch'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }
}))

/**
 * login view...
 *  
 */

const LoginView = props => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState(false)
  const [redirect, setRedirect] = useState(false)
  const [userData, setUserData] = useState(null)
  const [signup] = useMutation(SIGNUP)
  const [login] = useMutation(LOGIN)
  const classes = useStyles()

  /**
   * login handler 
   */

  const handleLogin = (_) => {
    login({
      variables: {
        username: username,
        password: password,
      }
    }).then(res => {
      if (res.data.loginUser) {
        setUserData(res.data.loginUser)
        setRedirect(true)
      } else {
        setError(true)
      }
    })
  }

  /**
   * signup handler 
   */

  const handleSignUp = (_) => {
    signup({
      variables: {
        username: username,
        password: password,
      }
    }).then(res => {
      if (res.data.createUser) {
        setUserData(res.data.createUser)
        setRedirect(true)
      } else {
        setError(true)
      }
    })
  }


  return (
    <div className={classes.container}>
      {redirect && (
        <Redirect 
          push 
          to={{
            pathname: '/main',
            state: { data: userData }
          }}
        />
      )}
      <Paper className={classes.loginContainer}>
        <Typography variant='h5' style={{ marginBottom: '2ch', fontWeight: 'bold' }}>
          Sign up or Login to start chatting!
        </Typography>
        {error && (
          <Typography 
            variant='subtitle' 
            style={{ 
              marginBottom: '2ch', 
              color: 'red',
            }}
          >
            Invalid Input or User already/does not exist
          </Typography>
        )}
        <FormControl className={classes.textField} variant='filled'>
          <InputLabel htmlFor='username'>Username</InputLabel>
          <FilledInput
            id='username'
            type={'text'}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl className={classes.textField} variant='filled'>
          <InputLabel htmlFor='password'>Password</InputLabel>
          <FilledInput
            id='password'
            type={show ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label='visible'
                  onClick={() => setShow(!show)}
                  onMouseDown={e => e.preventDefault()}
                  edge='end'
                >
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <div className={classes.row}>
          <Button 
            variant='contained' 
            color='primary'
            onClick={handleSignUp}
            style={{ marginRight: '10px' }}
          >
            Sign Up
          </Button>
          <Button 
            variant='contained' 
            color='primary'
            onClick={handleLogin}
            style={{ marginLeft: '10px' }}
          >
            Login
          </Button>
        </div>
      </Paper>
    </div>
  )
}

export default LoginView