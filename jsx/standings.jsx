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
		axios.get(`/api/${this.context.tournament.id}/results/?participant=${participant_id}`).then(response => {
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
		if(prevProps !== null && prevProps.match.params.id != this.props.match.params.id) {
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
	
	componentDidMount() {
		const ctx = this.context;

		if(ctx.tournament === null || ctx.tournament.slug != this.props.match.params.slug) {
			let url = `/api/${this.props.match.params.slug}/`;
			axios.get(url).then(
				response => {
					const tournament = response.data
					axios.get(`/api/${tournament.id}/participant/`).then(
						response => {
							tournament.participants = response.data
							this.context.setTournament(tournament)
						}
					)
				}
			);
		}
	}
	
	getLink(s) {
		console.log(s)
		const location = this.props.location.pathname
		if (location.endsWith('/')) {
			return location + s
		}
		else {
			return location + '/' + s;
		}
	}
	
	render() {
		 
		return (
	          <table className='table'>
	            <thead><tr><th>Position</th><th>Player</th><th>Wins</th><th>Losses</th><th>Spread</th></tr></thead>
	            <tbody>
					{this.context.tournament && this.context.tournament.participants.map((item, idx) =>  
					   {
						   if(item.player != 'Bye') {
							   return (<tr key={item.player}>
									    <td>{ item.position }</td>
										<td><Link to={ this.getLink('player/' + item.id.toString() + '/')  }>{item.player}</Link> </td>
										<td>{item.wins}</td>
										<td>{item.games - item.wins}</td>
										<td>{item.spread}</td>
										</tr>)
						   }
						   else {
							   return null
						   }
					   })
					}
	           </tbody>
	          </table>
        );
   }

}

