const Router = window.ReactRouterDOM.BrowserRouter;
const Route =  window.ReactRouterDOM.Route;
const Link =  window.ReactRouterDOM.Link;
const Prompt =  window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;

class PlayerStanding extends React.Component {
	constructor(props) {
		super(props);
	}
	/**
	 * Fetch the data when the component has mounted
	 */
	componentDidMount() {
		this.setState({'current_player': evt.target.name})
		axios.get(`/api/results/${this.props.tournament_id}/`, 
				{params: {player: props}}).then(response => {
					this.setState({'results': response.data});
		});
	}

	render() {
		if(this.state.current_player) {
			return(<div><h1>{this.state.current_player}</h1>
				<table className='table table-bordered'>  
				  <thead classNane='thead-light'><tr><th>Round</th><th>Opponent</th><th>Score</th><th>Opponent Score</th><th>Spread</th></tr></thead>
					<tbody>
					  {this.state.results.map(item=>(
						  <tr key={item.id} className={item.score_for > item.score_against ? "table-success" : "table-warning"}>
						     <td>{item.round}</td><td>{item.opponent}</td>
						     <td>{item.score_for}</td><td>{item.score_against}</td>
						     <td>{item.spread}</td>
						  </tr>)
					)}
					</tbody>
				</table></div>)
		}
	}
}
/**
 * Displays the standings
 */
class Standings extends React.Component {
	constructor(props) {
        super(props);
        this.state = {current_player: '', results: []}
    }
	
	render() {
		if(this.props.round) {
	        return (
	         <Router>
	          <div>
	          {this.props.standings.map((item, idx) => 
			   (null)
			)}
	          
	          <table className='table'>
	            <thead><tr><th>Position</th><th>Player</th><th>Wins</th><th>Losses</th><th>Spread</th></tr></thead>
	            <tbody>
					{this.props.standings.map((item, idx) => 
					   (<tr key={item.player}>
					    <td>{idx + 1}</td>
						<td><Link to={item.id.toString()}>{item.player}</Link> </td>
						<td>{item.wins}</td>
						<td>{item.games - item.wins}</td>
						<td>{item.spread}</td>
						</tr>)
					)}
	           </tbody>
	          </table>
	          </div>
	         </Router>
	        );
		}
		return null;
   }

}

