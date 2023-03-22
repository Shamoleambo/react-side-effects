import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef
} from 'react'

import Card from '../UI/Card/Card'
import classes from './Login.module.css'
import Button from '../UI/Button/Button'
import Input from '../UI/Input/Input'
import AuthContext from '../../store/auth-context'

const emailReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.includes('@') }
  } else if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') }
  }

  return { value: '', isValid: false }
}
const passwordReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.trim().length > 6 }
  } else if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.trim().length > 6 }
  }

  return { value: '', isValid: false }
}

const Login = props => {
  const ctx = useContext(AuthContext)

  const [formIsValid, setFormIsValid] = useState(false)
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: '',
    isValid: null
  })
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null
  })

  const { isValid: emailIsValid } = emailState
  const { isValid: passwordIsValid } = passwordState

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(emailIsValid && passwordIsValid)
    }, 500)

    return () => {
      clearTimeout(identifier)
    }
  }, [emailIsValid, passwordIsValid])

  const emailChangeHandler = event => {
    dispatchEmail({ type: 'USER_INPUT', val: event.target.value })
  }

  const passwordChangeHandler = event => {
    dispatchPassword({ type: 'USER_INPUT', val: event.target.value })
  }

  const validateEmailHandler = () => {
    dispatchEmail({ type: 'INPUT_BLUR' })
  }

  const validatePasswordHandler = () => {
    dispatchPassword({ type: 'INPUT_BLUR' })
  }

  const emailRef = useRef()
  const passwordRef = useRef()

  const submitHandler = event => {
    event.preventDefault()
    if (formIsValid) {
      ctx.onLogin(emailState.value, passwordState.value)
    } else if (!emailIsValid) {
      emailRef.current.focus()
    } else {
      passwordRef.current.focus()
    }
  }

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailRef}
          type='email'
          id='email'
          value={emailState.value}
          label='E-Mail'
          isValid={emailIsValid}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          ref={passwordRef}
          type='password'
          id='password'
          value={passwordState.value}
          label='Password'
          isValid={passwordIsValid}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type='submit' className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default Login
