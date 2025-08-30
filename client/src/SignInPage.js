import "./SignInPage.css";

import { useRef } from 'react';

function SignInPage(props) {
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    return (
        <div className="sign-in-page">
            <h1>Willkommen bei Benes Chat App</h1>
            <br/>
            <form>
                <label for="username" className="label">Username:</label><br/>
                <input ref={usernameRef} type="text" id="username" name="username" className="input-field" /><br/>
                <label for="password" className="label">Passwort:</label><br/>
                <input ref={passwordRef} type="text" id="password" name="password" className="input-field" /><br/>
                <div className="button-container">
                    <button type="button" className="button" onClick={() => handleSignIn(props.onSignIn, usernameRef, passwordRef)}>Anmelden</button>
                    <button type="button" className="button" onClick={() => handleSignUp(props.onSignIn, usernameRef, passwordRef)}>Registrieren</button>
                </div>
            </form>
        </div>
    )
}

function handleSignIn(onSignIn, usernameRef, passwordRef) {
    let username = usernameRef.current.value;
    let password = passwordRef.current.value;

    if (username && password) {
        fetch('http://localhost:4000/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        }).then(response => {
            response.json().then(data => {
                if (data.success) {
                    onSignIn(username);
                } else {
                    alert('Anmeldung fehlgeschlagen: ' + data.error);
                }
            });
        }).catch(error => {
            console.error('Error during sign-in:', error);
            alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
        });
    }
}

function handleSignUp(onSignIn, usernameRef, passwordRef) {
    let username = usernameRef.current.value;
    let password = passwordRef.current.value;

    if (username && password) {
        fetch('http://localhost:4000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        }).then(response => {
            response.json().then(data => {
                if (data.success) {
                    onSignIn(username);
                } else {
                    alert('Registrierung fehlgeschlagen: ' + data.error);
                }
            });
        }).catch(error => {
            console.error('Error during sign-up:', error);
            alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
        });
    }
}

export default SignInPage;