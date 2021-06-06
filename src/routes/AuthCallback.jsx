import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { useHistory } from 'react-router';

let AuthCallback = (props) => {
    let history = useHistory();
    const [state, setState] = useState("working");
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    useEffect(async () => {
        let queryParam = new URLSearchParams(window.location.search);

        try {
            let res = await axios.post(`${process.env.REACT_APP_YT_REQ_URL}/users`, {
                code: queryParam.get("code")
            });

            window.localStorage.setItem("yt_req_jwt", res.data.jwt);
            setState("success");
            setUser(res.data);
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