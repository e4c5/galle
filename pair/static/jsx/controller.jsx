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
 * The controller
 */
class Controller extends React.Component {
	/**
	 * The constructor
	 */
    constructor(props) {
    	super(props);
    	this.state = {'standings': [], 'pending': [], 'completed': [],  
    			tournament: {}, errors: '', round: 0}
    	
    	this.submitResult = this.submitResult.bind(this);
    }

	/**
	 * Fetch the data when the component has mounted
	 */
	componentDidMount() {
		let url = `/api/standings/${this.props.tournament_id}/`;
		axios.get(url).then(
			response => {
				const standings = [];
				response.data.map(item => {
					standings.push(item);
				});

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
			}
		);
		
		url = `/api/${this.props.tournament_id}/`;
		axios.get(url).then(
			response => {
				this.setState({'tournament': response.data, 'round': response.data.current_round});

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
	
	updateTournament(evt, tournament) {
		axios('/api/tournament/')
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
		           <Link className="nav-link active" to={window.location.pathname}>Standings</Link>
		           <Link className="nav-link" to={window.location.pathname + 'pairing'}>Data Entry</Link>
		           <Link className="nav-link" to={window.location.pathname + 'draw'}>Draw</Link>
		           <Link className="nav-link" to={window.location.pathname + 'settings'}>Settings</Link>
		        </nav>
    	         
			    	<Route path={window.location.pathname + '/'}
			       	 render={(props) => <Standings standings={this.state.standings} round={this.state.round} tournament_id={this.props.tournament_id}/>}
					 />
			        <Route path={window.location.pathname + 'pairing'}
			       	 render={(props) => 
					  	   <Pairing round={this.props.round} tournament_id={this.props.tournament_id} 
					  	       completed={this.state.completed} pending={this.state.pending} submitResult={this.submitResult}/>}
					 />
					 <Route path={window.location.pathname + "draw"}
						 render={props => 
					       <Draw completed={this.state.completed} pending={this.state.pending} />}
					 />
			         <Route path={window.location.pathname + "settings"}
							 render={props => 
						       <Settings tournament={this.state.tournament} />}
					 />      
			  </div>
			 </Router>	
			)
	}
}



const elem = document.getElementById('root-settings') 
ReactDOM.render(
  
     <Controller tournament_id={elem.dataset.tournament}/>, elem
);