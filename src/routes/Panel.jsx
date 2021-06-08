import React from 'react';
import { getRequests , getGame} from '../utils/ApiHelper';

class Panel extends React.Component {
	state = {
        mode: "NEXT_UP",
        requestList: []
    }

    updateRequestList = async () => {
        let channel = await getRequests(this.props.match.params.id);

        let requestList = await Promise.all(channel.requests.map(async (request) => {
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

        this.setState({requestList});
    }

	componentDidMount = () => {
        this.updateRequestList()

        // Poll rest service every 10 seconds
        setInterval(this.updateRequestList, 10000);

        // Cycle between next up view and queue view
        setInterval(this.showQueue, 1000 * 60);
	}

    showQueue = () => {
        this.setState({mode: "QUEUE"});
        setTimeout(() => {
            this.setState({mode: "NEXT_UP"})
        }, 1000 * 10);
    }

	render() {
		return (
			<div style={{height: "100vh", width: "100vw", userSelect: "none", position: "relative"}} className="App">
                    <div style={{width: "100vw", position: "absolute", bottom: "0px", left: "0px", textAlign: "center", fontSize: "20pt", WebkitTextStroke: "1px black", WebkitTextFillColor: "white"}} onClick={this.showQueue}>
                        {this.state.requestList.length > 0 ? 
                        <marquee>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Next up:&nbsp;</td>
                                        <td><img style={{height: "50px"}} src={this.state.requestList[0].cover} />&nbsp;</td> 
                                        <td>"{this.state.requestList[0].game}" requested by {this.state.requestList[0].requestor}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </marquee>
                        :
                        <marquee>No requests so far.  Make a request by donating!</marquee>}
                    </div>
                    <div style={{width: "100vw", position: "absolute", bottom: "0px", left: "0px", textAlign: "center"}}>
                        <div className={this.state.mode === "QUEUE" ? "open" : "closed"} style={{maxWidth: "50%", margin: "auto", padding: "0px 5px", backgroundColor: "gray", color: "white"}}>
                            <strong>Coming up:</strong>
                            <table style={{margin: "auto"}}>
                                <tbody>
                                {this.state.requestList.slice(0, 3).map((request, index) => {
                                    return (
                                        <tr key={`entry-${index}`} style={{color: index === 0 ? "yellow" : "white"}}>
                                            <td>{index + 1}</td>
                                            <td><img style={{height: "50px"}} src={request.cover} /></td>
                                            <td>{request.game}</td>
                                            <td>requested by {request.requestor}</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
			</div>
		);
	}
}

export default Panel;
