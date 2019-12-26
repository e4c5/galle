const Router = window.ReactRouterDOM.BrowserRouter;
const Route =  window.ReactRouterDOM.Route;
const Link =  window.ReactRouterDOM.Link;
const Prompt =  window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;
 

class Rounds extends React.Component {
	static contextType = TournamentContext
	
	constructor(props) {
		super(props);
		this.state = {loaded: false, round_no: 1, edit_row: -1};
	}
	
	componentDidMount() {
		
		if(this.context.tournament) {
			axios.get(`/api/${this.context.tournament.id}/results/`).then(response => {
				this.setState({results: response.data, loaded: true});
			});
		}
	}
	
	roundChange(e) {
		this.setState({round_no: evt.target.value})
	}
	
	
	render() {
		if(this.state.loaded) {
			const results = this.state.results.filter(r => { return r.round_no == this.state.round_no})
			return(
				<React.Fragment>
					<div className='row align-items-center'>
					    <div className='col-8'>
					    Display results for round number:
					    </div>
					    <div className='col-2'><input type='number' onChange={evt => this.roundChange(evt)} className='form-control' /></div>
				    </div>
				    <table className='table table-bordered'>  
					  <thead className='thead-light'>
					     <tr><th>Round</th><th>Player Score</th><th>Opponent</th><th>Opponent Score</th><th>Spread</th></tr>
					  </thead>
					  <tbody>
						  {results.map( (item, idx) =>(
							  <tr key={item.id}>
							     <td className='player'> { item.participant }</td>
							     <td>{item.score_for}</td>
							     <td className='opponent'>{ item.opponent != "Bye" ? <Link to={"../" + item.opponent_id + "/"}>{item.opponent}</Link>
							                                  : item.opponent }
							     </td>
							     <td>{item.score_against}</td>
							     <td>{item.score_for - item.score_against}</td>
							  </tr>)
						)}
					  </tbody>
					</table>
			   </React.Fragment>
		    )
		}
		return null;
	}
}

class Draw extends React.Component {
	constructor(props){ 
		super(props)
	}
	
	render() {
		return (<div>
			       <table className='table'><tbody>
			        {this.props.pending.map(item => (
				        	<tr key={item.id}><td>{item.participant}</td><td>{item.first}</td><td>{item.opponent}</td></tr>)
				    )}
			        {this.props.completed.map(item => (
			        	<tr className='table-secondary' key={item.id}><td>{item.participant}</td><td>{item.first}</td><td>{item.opponent}</td></tr>)
			        )}
			       </tbody></table>
			  </div>
		)
	}
	
}
/**
 * The main component
 */
class Main extends React.Component {
	static contextType = TournamentContext
	
    constructor(props) {
    	super(props);
    	this.state = {'standings': [], 'pending': [], 'completed': [],
    			errors: '', round: 0}
    	this.submitResult = this.submitResult.bind(this);
    	console.log("constrcut main")
    }

	
	findMatches(c) {
		return this.state.pending.filter(item => c.length > 1 && item.participant.toLowerCase().search(c) != -1).slice(0, 4);
	}	

	/**
	 * Handle submission of results
	 * 
	 * Has been lifted up from the pairing class.
	 */
	submitResult(evt, current) {
		this.setState({'errors': ''});
		
		const c = current.replace(/\d+/gi,'').trim().toLowerCase();
		const matching = this.findMatches(c);
		if(matching.length == 1) {
			try {
	 			const parts = current.split(" ");
	 			const record = Object.assign({}, matching[0]);
	 			const url = `/api/results/${this.props.tournament_id}/${record.id}/`;
			    axios.put(url, 
			        {'score_for': parts[parts.length -2], 'score_against': parts[parts.length-1]}
			    ).then(response => {
		    	
					record.score_for = response.data.score_for;
					record.score_against = response.data.score_against;
					let pending = this.state.pending.filter(item => item.id != record.id);
					let completed =this.state.completed.slice();
					completed.push(record);

					this.setState({completed: completed, pending: pending, matching: []});

			    }).catch(response => {
			    	this.setState({'errors': `Could not enter result for ${current}`})
			    })
			} catch (error) {
				this.setState({'errors': `Could not enter result for ${current}`})
			}
		}
		else if(matching.length == 0) {
			this.setState({'errors': 'No matches'})
		}
		else{
			this.setState({'errors': 'Multiple matches'})
		}
	}
	

	navBar() {
		if(this.context.basePath !== null) {
			console.log(this.context.basePath)
		
			return(
				<nav className='navbar'>
		           <Link className="nav-link active" to={ this.context.basePath }>Standings</Link>
		           <Link className="nav-link" to={ this.context.basePath + 'scoring' }>Scoring</Link>
		           <Link className="nav-link" to={ this.context.basePath + 'draw' }>Draw</Link>
		           <Link className="nav-link" to={ this.context.basePath + 'rounds' }>Rounds</Link>
		           <Link className="nav-link" to={ this.context.basePath + 'settings' }>Settings</Link>
		        </nav>)			
		}
		return null
	}
	/**
	 * This component render the router and a set of links
	 */
    render() {
    	console.log("Render main")
    	
    	return(<Router>
    	  <div> 
    	        { this.navBar() }
		        <Switch>
		        	<Route exact path="/tournament/:slug"
			       	    render={(props) => <Standings {...props} standings={this.state.standings}  /> }
					  />
					 
			         <Route path="/tournament/:slug/scoring"
			        	 render={(props) => 
					  	   <Pairing round={this.props.round} tournament_id={this.props.tournament_id} 
					  	       completed={this.state.completed} pending={this.state.pending} submitResult={this.submitResult}/>}
					 />
					 <Route path="/tournament/:slug/draw"
						 render={props => 
					       <Draw completed={this.state.completed} pending={this.state.pending} />}
					 />
			         <Route path="/tournament/:slug/settings"
							 render={props => 
						       <Settings />}
					 />
					 <Route path="/tournament/:slug/rounds" component={Rounds} />
					 <Route path="/tournament/:slug/player/:id/"
										render={(props) => <PlayerResult {...props} tournament_id={this.props.tournament_id}/> }
								     />
		       </Switch>
						       
		  </div>
	     </Router>	
		)
	}
}

