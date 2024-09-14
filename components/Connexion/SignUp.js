import React from 'react'
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { login } from '../../reducers/user';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import styles from '../../styles/LogIn.module.css'

import { checkMail } from '../../modules/checkMail';

export default function SignUp() {

  const router = useRouter()
	const dispatch = useDispatch();

  const [signUpAvatar, setSignUpAvatar] = useState();
  const [signUpUserName, setSignUpUserName] = useState('');
  const [signupEmail, setSignUpEmail] = useState('');
	const [signUpPassword, setSignUpPassword] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);

  const [erreur, setErreur] = useState({ statut: false, userName: true, email: true, message: '' })


  // Register by get the data of inputs
  const handleRegister = () => {

    if (!checkMail(signupEmail)) {
      setErreur({ statut: true, userName: true, email: false, message: 'Invalid email format' })
    } else {

      fetch('https://labup-backend.vercel.app/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: signUpAvatar, userName: signUpUserName, email: signupEmail, password: signUpPassword }),
      }).then(response => response.json())
        .then(data => {
          if (data.result) {

            dispatch(login({ token: data.token, userName: data.userName }));
            // setSignUpAvatar(URL.createObjectURL(e.target.files[0]));
            setSignUpUserName('');
            setSignUpEmail('');
            setSignUpPassword('');
            setIsDisabled(true);
            setErreur({ statut: true, userName: true, email: true, message: '' })

            router.push("/dashboard")

          } else {
            setErreur({ statut: true, userName: data.userName, email: data.email, message: data.error })
          }

        });
    }
	};

  // Get the button Enable
  useEffect(() => {
    setIsDisabled(!(signUpUserName && signupEmail && signUpPassword));
  }, [signUpUserName, signupEmail, signUpPassword]);
  const handleInputUsernameChange = (e) => {
    setSignUpUserName(e.target.value);
  };
  const handleEmailChange = (e) => {
    setSignUpEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setSignUpPassword(e.target.value);
  };


  return (
    <div className={styles.container}>
      <div className={styles.quote}>
        <p>"In the realm where pixels dance to the rhythm of imagination, creative coding is the symphony that transforms lines of code into a visual masterpiece, shaping the future with the brushstrokes of innovation."</p>
        <p>- Chatgpt</p>
      </div>
      <div className={styles.box}>
        <h1>Sign up to LabUp</h1>
        <div className={styles.inputsContainer}>
          <TextField error={!erreur.userName} id="outlined-basic" label="Username" variant="outlined" onChange={handleInputUsernameChange} value={signUpUserName} />
          <TextField error={!erreur.email} id="outlined-basic" label="Email address" variant="outlined" onChange={handleEmailChange} value={signupEmail} />
          <TextField id="outlined-basic" label="Password" type="password" variant="outlined" onChange={handlePasswordChange} value={signUpPassword} />
          {erreur.statut && <div style={{ color: 'red' }}> {erreur.message}</div>}

        </div>
        <Button variant="contained" disabled={isDisabled} onClick={handleRegister}> Create an account </Button> 
        <div className={styles.swtich}>
          <p>Already have an account?</p>
          <Button onClick={() => router.push('/signIn')}>Sign in</Button>
        </div>
      </div>
    </div>
  )
}