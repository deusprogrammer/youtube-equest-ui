import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import InfiniteScroll from 'react-infinite-scroll-component';

import {gameSearch, getGame, getChannel, updateRequests} from '../utils/ApiHelper';
import { toast } from 'react-toastify';

let RequestAdmin = (props) => {
    const [name, setName] = useState("");
    const [requestor, setRequestor] = useState("anonymous");
    const [selectedGame, setSelectedGame] = useState(null);
    const [searchTextPartial, setSearchTextPartial] = useState("");
    const [searchText, setSearchText] = useState("");
    const [searchPage, setSearchPage] = useState(0);
    const [searchResults, setSearchResults] = useState([]);
    const [searchMore, setSearchMore] = useState(true);
    const [requests, setRequests] = useState([]);

    let params = useParams();

    const searchGame = async (text, page = 0) => {
        try {
            console.log("SEARCH CALLED");
            let games = await gameSearch(text, page);

            if (games.length <= 0) {
                console.log("NO MORE SEARCH");
                setSearchMore(false);
            }

            let newResults = games.map((result) => {
                return (
                    {
                        id: result.id,
                        game: result.name,
                        cover: result.coverUrl
                    }
                )
            });

            setSearchResults([...searchResults, ...newResults]);

            if (page !== searchPage) {
                setSearchPage(page);
            }
        } catch (error) {
            console.error(error);
            toast("Failed to retrieve game search results", {type: "error"});
        }
    }

    const updateChannel = async (updatedRequests) => {
        try {
            let convertedRequests = updatedRequests.map((request) => {
                return (
                    {
                        igdbId: request.id,
                        requestor: request.requestor
                    }
                )
            });

            await updateRequests(params.id, convertedRequests);

            setRequests(updatedRequests);
            toast("Updated request queue successfully", {type: "info"});
        } catch (error) {
            console.error(error);
            toast("Failed to update request queue", {type: "error"});
        }
    }

    useEffect(async () => {
        try {
            let channel = await getChannel(params.id);

            setName(channel.name);

            let reqs = await Promise.all(channel.requests.map(async (request) => {
                let game = await getGame(request.igdbId);
                return (
                    {
                        id: game.id,
                        game: game.name,
                        cover: game.coverUrl,
                        requestor: request.requestor
                    }
                )
            }));

            setRequests(reqs);
            toast("Loaded channel request queue successfully", {type: "info"});
        } catch (error) {
            console.error(error);
            toast("Failed to load channel request queue", {type: "error"});
        }
    }, []);

    return (
        <div className="container">
            <h1>Channel {name}</h1>
            <div>
                { selectedGame ?
                <div className="row">
                    <h3>Add Game to Queue</h3>
                    <div style={{display: "table", margin: "auto"}}>
                        <div style={{display: "table-cell", verticalAlign: "middle"}}>
                            <img src={selectedGame.cover} />
                        </div>
                        <div style={{display: "table-cell", verticalAlign: "middle"}}>
                            {selectedGame.game}
                        </div>
                        <div style={{display: "table-cell", verticalAlign: "middle"}}>
                            <button 
                                className="btn btn-primary btn-lg"
                                onClick={() => {
                                    setSelectedGame(null);
                            }}>X</button>
                        </div>
                    </div>
                    <input 
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Requestor"
                        value={requestor}
                        onChange={(e) => {
                            setRequestor(e.target.value);
                        }} /><br />
                    <button 
                        className="btn btn-primary btn-lg"
                        onClick={() => {
                            let updatedRequests = [...requests, {
                                id: selectedGame.id,
                                game: selectedGame.game,
                                cover: selectedGame.cover,
                                requestor
                            }];
                            setSelectedGame(null);
                            setSearchText(null);
                            setSearchTextPartial(null);
                            setRequestor("anonymous");
                            setSearchResults([]);
                            updateChannel(updatedRequests);
                        }}>Add</button>
                </div> :
                <div>
                    <h3>Find Game</h3>
                    <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Game"
                        value={searchTextPartial}
                        onChange={(e) => {
                            setSearchTextPartial(e.target.value);
                        }}
                        onKeyUp={(e) => {
                            console.log(e.code);
                            if (e.code === "Enter") {
                                // Cancel the default action, if needed
                                e.preventDefault();
                                setSearchText(searchTextPartial);
                                searchGame(searchTextPartial);
                              }
                        }} />
                    <button 
                        className="btn btn-primary btn-lg"
                        onClick={() => {
                            setSearchText(searchTextPartial);
                            searchGame(searchTextPartial);
                        }}>Search</button>
                    {searchResults.length > 0 ? 
                    <InfiniteScroll
                            dataLength={searchResults.length}
                            next={() => {
                                searchGame(searchText, searchPage + 1)
                            }}
                            style={{height: "100vh"}}
                            hasMore={searchMore}
                            loader={<h4>Loading...</h4>}
                            endMessage={
                                <p style={{ textAlign: 'center' }}>
                                    <b>No more results</b>
                                </p>
                            }
                        >    
                            <table style={{margin: "auto"}}>
                                <tbody>
                                    {searchResults.map((request, index) => {
                                        return (
                                            <tr 
                                                key={`result-${index}`} 
                                                className="search-result"
                                                onClick={() => {
                                                    setSelectedGame(request);
                                                }}>
                                                <td>
                                                    <img className="search-result-image" src={request.cover} />
                                                </td>
                                                <td>{request.game}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                    </InfiniteScroll> : null }
                </div>
                }
            </div>
            {!selectedGame && !searchText ?
            <div className="row">
                <h3>Request Queue</h3>
                <table style={{margin: "auto"}}>
                    <tbody>
                        {requests.map((request, index) => {
                            return (
                                <tr 
                                    key={`request-${index}`}
                                    className="request-entry">
                                    <td>
                                        <img src={request.cover} />
                                    </td>
                                    <td>{request.game}</td>
                                    <td>requested by {request.requestor}</td>
                                    <td>
                                        <button 
                                            className="btn btn-primary btn-lg"
                                            style={{width: "100px"}}
                                            onClick={() => {
                                                let updatedRequests = [...requests];
                                                updatedRequests.splice(index, 1);
                                                updateChannel(updatedRequests);
                                            }}>{index === 0 ? "Next" : "Remove"}</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div> : null}
        </div>
    )
}

export default RequestAdmin;