import React from 'react'
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../reducers/user';
import { useRouter } from 'next/router';
import styles from '../../styles/LogIn.module.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


export default function SignIn() {

	const router = useRouter()
 	const dispatch = useDispatch();

	const [signInUserName, setSignInUserName] = useState('');
	const [signInPassword, setSignInPassword] = useState('');
	const [isDisabled, setIsDisabled] = useState(true);

	const [erreur, setErreur] = useState({ statut: false, message: '' })

	// Coonection by get the data of inputs
	const handleConnection = () => {
		fetch('http://localhost:3000/users/signin', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ credential: signInUserName, password: signInPassword }),
		}).then(response => response.json())
			.then(data => {
				if (data.result) {
					dispatch(login({ token: data.token, userName: data.userName }));
					setSignInUserName('');
					setSignInPassword('');
					setIsDisabled(true);
					setErreur({ statut: false, message: '' });

					router.push("/dashboard")
				} else {
					setErreur({ statut: true, message: 'Wrong Email or Password' })
				}
			});
	};

	console.log(signInPassword)

	// Get the button Enable
	useEffect(() => {
		setIsDisabled(!(signInUserName && signInPassword));
	}, [signInUserName, signInPassword]);
	const handleInputUsernameChange = (e) => {
		setSignInUserName(e.target.value);
	};
	const handlePasswordChange = (e) => {
		setSignInPassword(e.target.value);
	};


  return (
	<div className={styles.container}>
		<div className={styles.quote}>
			<p>"In the realm where pixels dance to the rhythm of imagination, creative coding is the symphony that transforms lines of code into a visual masterpiece, shaping the future with the brushstrokes of innovation."</p>
			<p>- Chatgpt</p>
		</div>
		<div className={styles.box}>
			<h1>Sign in to LabUp</h1>
			  <div className={styles.inputsContainer}>
				  <TextField error={erreur.statut} id="outlined-basic" label="Username or email" variant="outlined" onChange={handleInputUsernameChange} value={signInUserName} />
				<TextField id="outlined-basic" label="Password" type="password" variant="outlined" onChange={handlePasswordChange} value={signInPassword}/>
				  {erreur.statut && <div style={{ color: 'red' }}> {erreur.message}</div>}

			  </div>
			<Button variant="contained" disabled={isDisabled} onClick={handleConnection}> Se connecter </Button>
			<div className={styles.swtich}>
				<p>Don't have an account?</p>
				  <Button onClick={() => router.push('/signUp')}>Sign up</Button>
			  </div>


		</div>
	</div>
  )
}