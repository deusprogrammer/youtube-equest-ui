import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import {authUser} from '../utils/ApiHelper';

let AuthCallback = (props) => {
    let history = useHistory();
    const [state, setState] = useState("working");
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    useEffect(async () => {
        let queryParam = new URLSearchParams(window.location.search);

        try {
            let user = await authUser(queryParam.get("code"));

            window.localStorage.setItem("yt_req_jwt", user.jwt);
            setState("success");
            setUser(user);
            window.setTimeout(() => {
                history.push(`${process.env.PUBLIC_URL}/channels`);
            }, 3000);
        } catch (e) {
            console.error(e);
            setState("error");
            setError(e);
        }
    }, []);

    if (state === "working") {
        return (
            <div>
                <h1>Logging you In...</h1>
                <div>
                    <p>Authenticating with Google.</p>
                </div>
            </div>
        );
    } else if (state === "success") {
        return (
            <div>
                <h1>Success!</h1>
                <div>
                    {user ? <p>Welcome back <img src={user.ytAvatarUrl} />{user.ytUserName}.</p> : null}
                    <p>Authentication successful!  Auto redirecting to your channels.</p>
                </div>
            </div>
        );
    } else if (state === "error") {
        return (
            <div>
                <h1>Error!</h1>
                <div>
                    <p>Authentication failed!</p>
                </div>
            </div>
        );
    }
};

export default AuthCallback;