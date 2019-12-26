const Router = window.ReactRouterDOM.BrowserRouter;
const Route =  window.ReactRouterDOM.Route;
const Link =  window.ReactRouterDOM.Link;
const NavLink =  window.ReactRouterDOM.NavLink;
const Prompt =  window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;

/**
 * A players results in each round.
 */
class PlayerResult extends React.Component {
	static contextType = TournamentContext
	
	constructor(props) {
		super(props);
		this.state = {loaded: false, participant_id: null, edit_row: -1};
	}
	
	load(participant_id) {
		const ctx = this.context
		if(ctx.tournament) {
			axios.get(`/api/${ctx.tournament.id}/results/?participant=${participant_id}`).then(response => {
				this.setState({results: response.data, loaded: true, 
					current_player: this.context.getParticipant(participant_id)});
			});
		}
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
		if(this.state.edit_row != idx) {
			this.setState({edit_row: idx, score_against: this.state.results[idx].score_against, 
			    score_for: this.state.results[idx].score_for })
		}
	}
	
	updateScores(evt) {
		evt.preventDefault()
		if(evt.target.name == 'update') {
			this.state.results[this.state.edit_row].score_for = this.state.score_for
			this.state.results[this.state.edit_row].score_against = this.state.score_against
			this.setState({edit_row: -1})	
		}
		if(evt.target.name == 'cancel') {
			this.setState({edit_row: -1})	
		}
		else {
			const state = {...this.state}
			state[evt.target.name] = evt.target.value;
			this.setState(state)
		}
	} 
	
	buildEditRow() {
		return <React.Fragment>
			<td><input type='number' className='form-control' name='score_for' value={this.state.score_for} onClick={e => this.updateScores(e)}/></td>
			<td><input type='number' className='form-control' name='score_against' value={this.state.score_against} onClick={e => this.updateScores(e)}/></td>
			<td><button className='btn btn-primary' name='update' onClick={e => this.updateScores(e)}>Update</button>
            	<button className='btn btn-secondar' name='cancel' onClick={e => this.updateScores(e)} >Cancel</button></td>
            </React.Fragment>
	}
	
	humanize(num) {
		switch(num % 10){
			case 1: return 'st'
			case 2: return 'nd'
			case 3: return 'rd'
			default: return 'th'
		}
	}
	render() {
		if(this.state.loaded) {
			const current = this.state.current_player
			return(<div><h1>{current.player.full_name}</h1>
			 <h2>In {current.position}{ this.humanize(current) } place with { current.wins } wins and a margin of { current.spread }</h2>
				<table className='table table-bordered'>  
				  <thead className='thead-light'>
				     <tr><th>Round</th><th>Opponent</th><th>Player Score</th><th>Opponent Score</th><th>Spread</th></tr>
				  </thead>
				  <tbody>
					  {this.state.results.map( (item, idx) =>(
						  <tr key={item.id} className={item.score_for > item.score_against ? "table-success" : "table-warning"}>
						     <td>{item.round_no}</td>
						     <td className='opponent'>{ item.opponent != "Bye" ? <Link to={"../" + item.opponent_id + "/"}>{item.opponent}</Link>
						                                  : item.opponent }
						     </td>
						     { this.state.edit_row == idx ? this.buildEditRow()
						    		 : (<React.Fragment><td onClick={ e=> this.editRow(e, idx)}>{item.score_for}</td>
						    		                    <td onClick={ e=> this.editRow(e, idx)}>{item.score_against}</td><td>{item.spread}</td></React.Fragment>) }
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
		console.log("Constrcut standings")
    }
	
	componentDidMount() {
		const ctx = this.context;

		if(ctx.tournament === null || ctx.tournament.slug != this.props.match.params.slug) {
			let url = `/api/${this.props.match.params.slug}/`;
			axios.get(url).then(
				response => {
					const tournament = response.data
					console.log("Get tournament 1")
					axios.get(`/api/${tournament.id}/participant/`).then(
						response => {
							console.log("Get tournament 2")
							this.context.setTournament(tournament)
							this.context.setParticipants(response.data)
						}
					)
				}
			);
		}
	}
	
	getLink(s) {
		const location = this.props.location.pathname
		if (location.endsWith('/')) {
			return location + s
		}
		else {
			return location + '/' + s;
		}
	}
	
	render() {
		if(this.context.tournament == null) {
			return null;
		}
		return (
		    <div>
		      <h1>{this.context.tournament.name}</h1>
	          <table className='table'>
	            <thead><tr><th>Position</th><th>Player</th><th>Wins</th><th>Losses</th><th>Spread</th></tr></thead>
	            <tbody>
					{this.context.tournament && this.context.participants && 
						Object.keys(this.context.participants).map( idx =>  
					   {
						   const item = this.context.participants[idx]
						   if(item.player != 'Bye') {
							   return (<tr key={item.id}>
									    <td>{ item.position }</td>
										<td><Link to={ this.getLink('player/' + item.id.toString() + '/')  }>{item.player.full_name}</Link> </td>
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
	       </div>
        );
   }

}

