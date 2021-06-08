import axios from 'axios';

const getOptions = () => {
    return {
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem("yt_req_jwt")}`
        }
    };
}

export const gameSearch = async (text, page) => {
    let res = await axios.get(`${global.YT_REQ_URL}/games?search=${text}&page=${page}&pageSize=10`);
    return res.data;
}

export const getGame = async (gameId) => {
    let res = await axios.get(`${global.YT_REQ_URL}/games/${gameId}`);
    return res.data;
}

export const getUsers = async () => {
    let res = await axios.get(`${global.YT_REQ_URL}/users`);
    return res.data;
}

export const getUser = async (id) => {
    let res = await axios.get(`${global.YT_REQ_URL}/users/${id}`);
    return res.data;
}

export const authUser = async (code) => {
    let res = await axios.post(`${global.YT_REQ_URL}/users`, {
        code
    });

    return res.data;
}

export const getRequests = async (id) => {
    let res = await axios.get(`${global.YT_REQ_URL}/channels/${id}`, {
        headers: {
            Authorization: `Bearer ${window.localStorage.getItem("yt_req_jwt")}`
        }
    });

    return res.data;
}

export const getMyUser = async () => {
    try {
        let res = await axios.get(`${global.YT_REQ_URL}/me`, getOptions());
        return res.data;
    } catch (error) {
        // If jwt expired, then store the new jwt and retry.
        if (error.response.data.newJwt) {
            console.log("Expired JWT");
            window.localStorage.setItem("yt_req_jwt", error.response.data.newJwt);
            return await getMyUser();
        }
    }
}

export const createChannel = async (name) => {
    try {
        let res = await axios.post(`${global.YT_REQ_URL}/channels`, {
            name
        }, getOptions());
        return res.data;
    } catch (error) {
        // If jwt expired, then store the new jwt and retry.
        if (error.response.data.newJwt) {
            console.log("Expired JWT");
            window.localStorage.setItem("yt_req_jwt", error.response.data.newJwt);
            return await createChannel(name);
        }
    }
}

export const getChannels = async () => {
    try {
        let res = await axios.get(`${global.YT_REQ_URL}/channels`, getOptions());
        return res.data;
    } catch (error) {
        // If jwt expired, then store the new jwt and retry.
        if (error.response.data.newJwt) {
            console.log("Expired JWT");
            window.localStorage.setItem("yt_req_jwt", error.response.data.newJwt);
            return await getChannels();
        }
    }
}

export const getChannel = async (channelId) => {
    try {
        let res = await axios.get(`${global.YT_REQ_URL}/channels/${channelId}`, getOptions());
        return res.data;
    } catch (error) {
        // If jwt expired, then store the new jwt and retry.
        if (error.response.data.newJwt) {
            console.log("Expired JWT");
            window.localStorage.setItem("yt_req_jwt", error.response.data.newJwt);
            return await getChannel(channelId);
        }
    }
}

export const updateChannel = async (id, channelData) => {
    try {
        let res = await axios.put(`${global.YT_REQ_URL}/channels/${id}`, channelData, getOptions());
        return res.data;
    } catch (error) {
        // If jwt expired, then store the new jwt and retry.
        if (error.response.data.newJwt) {
            console.log("Expired JWT");
            window.localStorage.setItem("yt_req_jwt", error.response.data.newJwt);
            return await updateChannel(id, channelData);
        }
    }
}

export const updateRequests = async (id, requests) => {
    try {
        let res = await axios.put(`${global.YT_REQ_URL}/channels/${id}/requests`, requests, getOptions());
        return res.data;
    } catch (error) {
        // If jwt expired, then store the new jwt and retry.
        if (error.response.data.newJwt) {
            console.log("Expired JWT");
            window.localStorage.setItem("yt_req_jwt", error.response.data.newJwt);
            return await updateRequests(id, requests);
        }
    }
}