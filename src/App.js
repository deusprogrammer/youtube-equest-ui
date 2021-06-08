import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import RequestAdmin from './routes/RequestAdmin';
import Panel from './routes/Panel';
import Auth from './routes/Auth';
import AuthCallback from './routes/AuthCallback';
import Channels from './routes/Channels';
import ChannelAdmin from './routes/ChannelAdmin';

import {ToastContainer} from 'react-toastify';
import 'bootstrap';

window.YT_REQ_URL = process.env.REACT_APP_YT_REQ_URL != undefined ? process.env.REACT_APP_YT_REQ_URL : "https://deusprogrammer.com/api/yt";
window.YT_CB_HOST = process.env.REACT_APP_YT_CB_HOST != undefined ? process.env.REACT_APP_YT_CB_HOST : "https://deusprogrammer.com";

function App() {
    return (
        <div className="App">
            <ToastContainer />
            <Router>
                <Switch>
                    <Route exact path={`${process.env.PUBLIC_URL}/`} component={Channels} />
                    <Route exact path={`${process.env.PUBLIC_URL}/channels/`} component={Channels} />
                    <Route exact path={`${process.env.PUBLIC_URL}/channels/:id/admin`} component={RequestAdmin} />
                    <Route exact path={`${process.env.PUBLIC_URL}/channels/:id/config`} component={ChannelAdmin} />
                    <Route exact path={`${process.env.PUBLIC_URL}/channels/:id/panel`} component={Panel} />
                    <Route exact path={`${process.env.PUBLIC_URL}/auth`} component={Auth} />
                    <Route exact path={`${process.env.PUBLIC_URL}/auth/callback`} component={AuthCallback} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
