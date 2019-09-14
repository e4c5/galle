const Router = window.ReactRouterDOM.BrowserRouter;
const Route =  window.ReactRouterDOM.Route;
const Link =  window.ReactRouterDOM.Link;
const Prompt =  window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;
 

class Draw extends React.Component {
	constructor(props){ 
		console.log(props);
		super(props)
	}
	
	render() {
		console.log(this.props);
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
    }

	/**
	 * Fetch the data when the component has mounted
	 */
	componentDidMount() {
		
		if(this.context.basePath === null) {
			this.context.setBasePath(window.location.pathname)
		}
		
		let url = `/api/${this.props.tournament_id}/participant`;
		axios.get(url).then(
			response => {
				const standings = response.data;

				standings.sort(function(a,b){
					if(a.wins == b.wins) {
						if(a.games == b.games) {
							return b.spread - a.spread;
						}
						return b.games - a.games;
					}
					return b.wins - a.wins;
				});
				this.setState({'standings': standings});
				this.context.setParticipants(standings);
			}
		);
		
		url = `/api/${this.props.tournament_id}/`;
		axios.get(url).then(
			response => {
				this.context.setTournament(response.data);

				/* on success we load the results */
				let url = `/api/results/${this.props.tournament_id}/?round=${response.data.current_round}`;
				axios.get(url).then(
					response => {
						const completed = [];
						const pending = [];
						response.data.map(item => {
							if(item.score_for) {
								if(! completed.length) {
									completed.push(item);
								}
								else if(! completed.filter(old => old.participant == item.opponent).length) {
									completed.push(item);
								}
							}
							else{
								if(!pending.length) {
									pending.push(item);
								}
								else if(! pending.filter(old => old.participant == item.opponent).length) {
									pending.push(item);
								}
							}
						});

						this.setState({'completed': completed, 'pending': pending});
					}
				);
			}
		);
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
	
	
    render() {
    	return(<Router>
    	  <div>
		    	 <nav className='navbar'>
		           <Link className="nav-link active" to={this.context.basePath}>Standings</Link>
		           <Link className="nav-link" to={this.context.basePath + 'pairing'}>Data Entry</Link>
		           <Link className="nav-link" to={this.context.basePath + 'draw'}>Draw</Link>
		           <Link className="nav-link" to={this.context.basePath + 'settings'}>Settings</Link>
		        </nav>
		        <Switch>
      
			    	<Route exact path={this.context.basePath }
			       	 render={(props) => <Standings {...props} standings={this.state.standings}  /> }
					 />
			        <Route path={this.context.basePath + 'pairing'}
			        	 render={(props) => 
					  	   <Pairing round={this.props.round} tournament_id={this.props.tournament_id} 
					  	       completed={this.state.completed} pending={this.state.pending} submitResult={this.submitResult}/>}
					 />
					 <Route path={this.context.basePath + "draw"}
						 render={props => 
					       <Draw completed={this.state.completed} pending={this.state.pending} />}
					 />
			         <Route path={this.context.basePath + "settings"}
							 render={props => 
						       <Settings />}
					 />      
					 <Route path={ this.context.basePath + "player/:id/"}
										render={(props) => <PlayerStanding {...props} tournament_id={this.props.tournament_id}/> }
								     />
			       </Switch>
						       
		  </div>
	     </Router>	
		)
	}
}



const elem = document.getElementById('root-settings') 
ReactDOM.render(
   <TournamentProvider>
     <Main tournament_id={elem.dataset.tournament}/>
   </TournamentProvider>  
     , elem
);