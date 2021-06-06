import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import { getChannels, createChannel } from '../utils/ApiHelper';

let Channels = (props) => {
    const [channels, setChannels] = useState([]);
    const [channelName, setChannelName] = useState(null);
    const [disableButtons, setDisableButtons] = useState(false);

    useEffect(async () => {
        try {
            let channels = await getChannels();
            setChannels(channels);
            toast("Loaded channel list successfully", {type: "info"});
        } catch (error) {
            console.error(error);
            toast("Failed to load channel list", {type: "error"});
        }
    }, []);

    const createNewChannel = async (name) => {
        try {
            setDisableButtons(true);
            let channel = await createChannel(name);
            setChannels([...channels, channel]);
            setDisableButtons(false);
            setChannelName(null);
            toast("Created new channel successfully", {type: "info"});
        } catch (error) {
            console.error(error);
            toast("Failed to create new channel", {type: "error"});
        }
    }

    return (
        <div>
            <h1>Channel Dashboard</h1>
            <h3>Create New Channel</h3>
            <input type="text" 
                onChange={(e) => {
                    setChannelName(e.target.value);
                }} 
                value={channelName}
                placeholder="Name" />
            <button onClick={() => {createNewChannel(channelName)}} disabled={disableButtons}>Create New Channel</button>
            <h3>Your Channels</h3>
            <table style={{margin: "auto"}}>
                <tbody>
                {channels.map((channel) => {
                    return (
                        <tr>
                            <td>{channel.name}</td>
                            <td><Link to={`${process.env.PUBLIC_URL}/channels/${channel._id}/admin`}><button>Request Admin</button></Link></td>
                            <td><Link to={`${process.env.PUBLIC_URL}/channels/${channel._id}/config`}><button>Channel Config</button></Link></td>
                            <td><Link to={`${process.env.PUBLIC_URL}/channels/${channel._id}/panel`}><button>Panel</button></Link></td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    )
}

export default Channels;