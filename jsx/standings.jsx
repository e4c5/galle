const Router = window.ReactRouterDOM.BrowserRouter;
const Route =  window.ReactRouterDOM.Route;
const Link =  window.ReactRouterDOM.Link;
const Prompt =  window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;

class PlayerStanding extends React.Component {
	constructor(props) {
		super(props);
		this.state = {loaded: false};
	}
	/**
	 * Fetch the data when the component has mounted
	 */
	componentDidMount() {
		
		axios.get(`/api/results/${this.props.tournament_id}/?participant=${this.props.match.params.id}`).then(response => {
			this.setState({'results': response.data, 'loaded': true});
		});
	}

	render() {
		
		if(this.state.loaded) {
			return(<div><h1>{this.state.current_player}</h1>
				<table className='table table-bordered'>  
				  <thead className='thead-light'><tr><th>Round</th><th>Opponent</th><th>Score</th><th>Opponent Score</th><th>Spread</th></tr></thead>
					<tbody>
					  {this.state.results.map(item=>(
						  <tr key={item.id} className={item.score_for > item.score_against ? "table-success" : "table-warning"}>
						     <td>{item.round_no}</td><td>{item.opponent}</td>
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
	constructor(props) {
		console.log("WTf")
        super(props);
        this.state = {current_player: '', results: []}
    }
	
	render() {
		return (
	         
	          <div>
	         
	          
	          <table className='table'>
	            <thead><tr><th>Position</th><th>Player</th><th>Wins</th><th>Losses</th><th>Spread</th></tr></thead>
	            <tbody>
					{this.props.standings.map((item, idx) => 
					   (<tr key={item.player}>
					    <td>{idx + 1}</td>
						<td><Link to={window.location.pathname + 'player/' + item.id.toString() + '/'}>{item.player}</Link> </td>
						<td>{item.wins}</td>
						<td>{item.games - item.wins}</td>
						<td>{item.spread}</td>
						</tr>)
					)}
	           </tbody>
	          </table>
	          </div>
			     
			 
        );
   }

}

