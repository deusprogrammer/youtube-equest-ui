import React from 'react';


const REDIRECT_URI = process.env.REACT_APP_YT_REDIRECT_URI;
const YT_CLIENT_ID = process.env.REACT_APP_YT_CLIENT_ID;
const SCOPES = "https://www.googleapis.com/auth/youtube email openid profile";
const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/auth?approval_prompt=force&scope=${SCOPES}&client_id=${YT_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&access_type=offline`;

let Auth = (props) => {
    return (
        <div>
            <h1>Youtube Auth</h1>
            <p>By logging into Youtube, you are only allowing us to verify your identity for access to our request app.  No other data is being collected or stored.</p>
            <a href={GOOGLE_AUTH_URL}><button>Login</button></a>
        </div>
    )
};

export default Auth;