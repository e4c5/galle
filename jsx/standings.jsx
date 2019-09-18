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
		super(props);
		this.state = {loaded: false, participant_id: null};
	}
	
	load(participant_id) {
		axios.get(`/api/${this.props.tournament_id}/results/?participant=${participant_id}`).then(response => {
			this.setState({'results': response.data, 'loaded': true, 
				'participant_id': participant_id});
		});
	}
	
	componentDidUpdate(prevProps) {
		/*
		 * Using both component did upadate and component did mount in this
		 * manner is crucial to making the UI update when the user clicks a link
		 * to another player within a player standing page
		 */
		if(prevProps !== undefined && prevProps.match.params.id != this.props.match.params.id) {
			this.load(this.props.match.params.id)
		}
	}
	
	componentDidMount() {
		this.load(this.props.match.params.id)
	}

	editRow(e, idx) {
		console.log(idx);
	}
	
	render() {
		if(this.state.loaded) {
			return(<div><h1>{this.state.current_player}</h1>
				<table className='table table-bordered'>  
				  <thead className='thead-light'>
				     <tr><th>Round</th><th>Opponent</th><th>Score</th><th>Opponent Score</th><th>Spread</th></tr>
				  </thead>
				  <tbody>
					  {this.state.results.map( (item, idx) =>(
						  <tr key={item.id} className={item.score_for > item.score_against ? "table-success" : "table-warning"}
						     onClick={ e=> this.editRow(e, idx)}
						  >
						     <td>{item.round_no}</td>
						     <td>{ item.opponent != "Bye" ? <Link to={"../" + item.opponent_id + "/"}>{item.opponent}</Link>
						                                  : item.opponent }
						     </td>
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

