import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';

import {getChannel, getUsers, getUser, getMyUser, updateChannel} from '../utils/ApiHelper';

let ChannelAdmin = (props) => {
    let params = useParams();
    const [name, setName] = useState("");
    const [channel, setChannel] = useState({});
    const [authorizedUsers, setAuthorizedUsers] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [me, setMe] = useState({});
    const [buttonsDisabled, setButtonsDisabled] = useState(false);

    const updateChannelUsers = async () => {
        try {
            let idList = authorizedUsers.map((user) => {
                return user.ytUserId;
            });

            setButtonsDisabled(true);

            await updateChannel(params.id, {...channel, 
                authorizedUsers: idList
            });

            toast("Saved channel config successfully", {type: "info"});
            setButtonsDisabled(false);
        } catch (error) {
            console.error(error);
            toast("Channel config save failed", {type: "error"});
        }
    }

    useEffect(async () => {
        try {
            let channel = await getChannel(params.id);
            let users = await getUsers();
            let myUser = await getMyUser();

            let convertedUsers = await Promise.all(channel.authorizedUsers.map(async (userId) => {
                return await getUser(userId);
            }));

            setAuthorizedUsers(convertedUsers);
            setAvailableUsers(users);
            setName(channel.name);
            setChannel(channel);
            setMe(myUser);

            toast("Pulled channel data successfully", {type: "info"});
        } catch (error) {
            console.error(error);
            toast("Failed to retrieve channel data", {type: "error"});
        }
    }, []);

    return (
        <div>
            <h1>Channel {name} Config</h1>
            <div>
                <h2>Authorized Users</h2>
                <table style={{margin: "auto"}}>
                    <tbody>
                        {authorizedUsers.map((user, index) => {
                            return (
                                <tr key={`au-${user.ytUsderId}-${index}`}>
                                    <td><img src={user.ytAvatarUrl} /></td>
                                    <td>{user.ytUsername}</td>
                                    <td>
                                        <button onClick={() => {
                                            let users = [...authorizedUsers];
                                            users.splice(index, 1);
                                            setAuthorizedUsers(users);
                                        }}
                                        disabled={buttonsDisabled}>Remove</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div>
                <h2>Available Users</h2>
                <table style={{margin: "auto"}}>
                    <tbody>
                        {availableUsers.map((user, index) => {
                            if (me.ytUserId !== user.ytUserId && !authorizedUsers.map(u => u.ytUserId).includes(user.ytUserId)) {
                                return (
                                    <tr key={`u-${user.ytUsderId}-${index}`}>
                                        <td><img src={user.ytAvatarUrl} /></td>
                                        <td>{user.ytUsername}</td>
                                        <td><button onClick={() => {
                                            setAuthorizedUsers([...authorizedUsers, user]);
                                        }}
                                        disabled={buttonsDisabled}>Add</button></td>
                                    </tr>
                                )
                            }
                        })}
                    </tbody>
                </table>
                <button onClick={() => {
                    updateChannelUsers();
                }}
                disabled={buttonsDisabled}>Save</button>
            </div>
        </div>
    )
}

export default ChannelAdmin;