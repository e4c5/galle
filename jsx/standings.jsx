const Router = window.ReactRouterDOM.BrowserRouter;
const Route =  window.ReactRouterDOM.Route;
const Link =  window.ReactRouterDOM.Link;
const NavLink =  window.ReactRouterDOM.NavLink;
const Prompt =  window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;

class PlayerStanding extends React.Component {
	static contextType = TournamentContext
	
	constructor(props) {
		console.log("Reconstruct")
		super(props);
		this.state = {loaded: false};
	}
	
	load(participant_id) {
		axios.get(`/api/${this.props.tournament_id}/results/?participant=${participant_id}`).then(response => {
			this.setState({'results': response.data, 'loaded': true});
		});
	}
	
	switchPlayer(e, participant_id) {
		e.preventDefault();
		this.load(participant_id)
	}
	componentDidMount() {
		this.load(this.props.match.params.id)
	}

	render() {
		if(this.state.loaded) {
			return(<div><h1>{this.state.current_player}</h1>
				<table className='table table-bordered'>  
				  <thead className='thead-light'><tr><th>Round</th><th>Opponent</th><th>Score</th><th>Opponent Score</th><th>Spread</th></tr></thead>
					<tbody>
					  {this.state.results.map(item=>(
						  <tr key={item.id} className={item.score_for > item.score_against ? "table-success" : "table-warning"}>
						     <td>{item.round_no}</td>
						     <td><a onClick={ e => this.switchPlayer(e, item.opponent_id) }>{item.opponent}</a></td>
						     <td>{item.score_for}</td><td>{item.score_against}</td>
						     <td>{item.spread}</td>
						  </tr>)
					)}
					</tbody>
				</table></div>)
		}
		return (<div>Loading....</div>)
		
	}
}
/**
 * Displays the standings
 */
class Standings extends React.Component {
	static contextType = TournamentContext
	constructor(props) {
        super(props);
        this.state = {current_player: '', results: []}
    }
	
	render() {
		return (
	          <table className='table'>
	            <thead><tr><th>Position</th><th>Player</th><th>Wins</th><th>Losses</th><th>Spread</th></tr></thead>
	            <tbody>
					{this.props.standings.map((item, idx) => 
					   (<tr key={item.player}>
					    <td>{idx + 1}</td>
						<td><Link to={this.context.basePath + 'player/' + item.id.toString() + '/'}>{item.player}</Link> </td>
						<td>{item.wins}</td>
						<td>{item.games - item.wins}</td>
						<td>{item.spread}</td>
						</tr>)
					)}
	           </tbody>
	          </table>
        );
   }

}

