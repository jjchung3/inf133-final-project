import React, { useState, useEffect, useCallback } from 'react'
import { useSubscription, useMutation, useQuery } from 'react-apollo'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { CHATS, CHAT_SUBSCRIPTION, SEND_MESSAGE, LOGOUT } from '../queries/queries'
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
  chatContainer: {
    height: '880px',
    width: '600px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#172b3a',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: '25px',
  },
  innerChatContainer: {
    marginTop: 'auto',
    marginBottom: '10px',
    width: '550px',
    maxWidth: '550px',
    height: '512px',
    backgroundColor: '#0f202d',
    overflowY: 'scroll',
    overflowX: 'hidden',
  },
  inputContainer: {
    marginTop: '10px',
    marginBottom: '25px',
    width: '550px',
    height: '208px',
    backgroundColor: '#0f202d'
  },
  messageContainer: {
    marginTop: '20px',
    marginBottom: '20px',
    marginLeft: '20px',
    minWidth: '100px',
    maxWidth: '400px',
    minHeight: '50px',
    height: 'auto',
    padding: '5px 8px 8px 8px',
    borderWidth: '2px',
    borderColor: '#3089cd',
    borderRadius: '5px',
    backgroundColor: '#F6F6F6'
  },
  messageContainerMine: {
    marginTop: '20px',
    marginBottom: '20px',
    marginRight: '20px',
    marginLeft: 'auto',
    minWidth: '100px',
    maxWidth: '400px',
    minHeight: '50px',
    height: 'auto',
    padding: '5px 8px 8px 8px',
    borderWidth: '2px',
    borderColor: '#3089cd',
    borderRadius: '5px',
    backgroundColor: '#F6F6F6',
  },
  fromContainer: {
    width: '100%',
    height: '10%',
  },
  fromText: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#c23d87'
  },
  titleText: {
    marginTop: '16px',
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#c23d87',
  },
  textField: {
    color: 'white'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }
}))

const InnerView = props => {
  const [user, setUser] = useState(null)
  const [redirect, setRedirect] = useState(false)
  const { loading, data: chatsData, error } = useQuery(CHATS)
  const [send] = useMutation(SEND_MESSAGE)
  const [logout] = useMutation(LOGOUT)

  useEffect(() => {
    if (!props.history.location.state.data) {
      setRedirect(true)
    } else {
      setUser(props.history.location.state.data)
    }
  },[props.history.location.state.data])

  const handleLogout = (_) => {
    logout()
    setRedirect(true)
  }
  
  if (loading) return <></>
  if (error) return <></>

  return (
    <>
      {redirect && (
        <Redirect 
          push 
          to={{
            pathname: '/login',
          }}
        />
      )}
      <MainView
        user={user}
        chatsData={chatsData.chats}
        send={send}
        handleLogout={handleLogout}
      />
    </>
  )
}

const MainView = ({ chatsData, user, send, handleLogout }) => {
  const [message, setMessage] = useState('')
  const [data, setData] = useState(chatsData)
  const ref = React.useRef()
  const classes = useStyles()

  /**
   * starting the subscription pipeline...
   */
  const LatestMessage = () => { 
    useSubscription(
      CHAT_SUBSCRIPTION,
      {
        onSubscriptionData: (res) => {
          if (res.subscriptionData.data.liveMessages) {
            setData([
              ...data,
              res.subscriptionData.data.liveMessages
            ])
          }
        }
      }
    )
    return <></>
  }

  const handleSend = (_) => {
    send({
      variables: {
        fromId: user.id,
        from: user.username,
        message: message,
      }
    })
    setMessage('')
  }


  const onEnter = (e) => {
    if(e.keyCode === 13){
      handleSend(e)
    }
  }

  useEffect(() => {
    ref.current.scrollIntoView({ behaviour: 'smooth' })
  }, [data])

  LatestMessage()

  return (
    <div className={classes.container}>
      <Paper 
        className={classes.chatContainer}
        elevation={4}
      >
        <Typography
          varient={'h1'}
          className={classes.titleText}
        >
          Just the best chat app...
        </Typography>
        <Paper 
          className={classes.innerChatContainer}
          elevation={0}
        >
          {user && data.map((msg) => {
            return (
              <Message
                key={msg.id}
                id={user.id}
                fromId={msg.fromId}
                from={msg.from}
                message={msg.message}
                classes={classes}
              />
            )
          })}
          <div ref={(scrollref) => ref.current = scrollref }/>
        </Paper>
        <div className={classes.buttonContainer}>
          <Button 
            variant='contained' 
            color='primary'
            onClick={handleSend}
            style={{ marginRight: '15px', fontWeight: 'bold' }}
          >
            Send
          </Button>
          <Button 
            variant='contained' 
            color='secondary'
            style={{ fontWeight: 'bold' }}
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
        <Paper 
          className={classes.inputContainer}
          elevation={0}
        >
          <TextField 
            multiline
            rows={9}
            rowsMax={9}
            variant={'filled'}
            fullWidth
            InputProps={{
              className: classes.textField
            }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={onEnter}
          />
        </Paper>
      </Paper>
    </div>
  )
}

const Message = React.memo(({ id, fromId, from, message, classes }) => {

  const forker = useCallback((id, fromId, classes) => {
    if (id === fromId) {
      return classes.messageContainerMine
    } else {
      return classes.messageContainer
    }
  }, [])

  return (
    <div className={forker(id, fromId, classes)}>
      <div className={classes.fromContainer}>
        <Typography 
          className={classes.fromText}
        >
          from: {from}
        </Typography>
      </div>
      {message}
    </div>
  )
})

export default InnerView