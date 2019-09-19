const elem = document.getElementById('root') 

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

class Importer extends React.Component {
	render() {
		return 'TSH Import'
	}
}


class Tournaments extends React.Component {
	static contextType = TournamentContext
	
	render() {
		if (this.props.tournaments != null) {
			return(
			  <div><h1>Tournaments</h1>
				<table>
				 <tbody>
				   { this.props.tournaments.map(item =>(
						   <tr key={item.id}>
						      <td><Link to={ "/tournament/" +  item.slug }>{item.name}</Link></td>
						      <td>{ item.start_data}</td>
						   </tr>
				   		)
					 )
				   }
				 </tbody>
				</table>
				<Link className='btn btn-primary' to='/new/'>New Tournament</Link>
				<Link className='btn btn-primary' to='/import/'>TSH Import</Link>
			  </div>
						
			)
		}
		return null
	}
}

class Start extends React.Component {
	static contextType = TournamentContext
	
	constructor(props) {
		super(props);
		this.state = {}
	}
	
	componentDidMount() {
		axios.get("/api/").then(
			response => {
				this.setState({tournaments: response.data});
			}
		);
	}

	getComponent() {
		if(this.context.tournament === null) {
			console.log("TOURNAMENT")
		
			return <Tournaments tournaments={this.state.tournaments}/>
		}
		else {
			console.log('MAIN');
		
			return <Main  />
		}
	}
	
    render() {
    	return(<Router>
		        <Switch>
			      	 <Route exact path="/tournament/:slug"
			       	    render={(props) => <Standings {...props} standings={this.state.standings}  /> }
					  />
					 <Route exact path="/import/" component={Importer}  />
					 <Route exact path="/new/" component={Settings}  />
					 
			         <Route path="/tournament/:slug/pairing"
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
										render={(props) => <PlayerStanding {...props} tournament_id={this.props.tournament_id}/> }
								     />
			       </Switch>
				   { this.getComponent() }
	     </Router>	
		)
	}
}



ReactDOM.render(
	<TournamentProvider>
        <Start/>
    </TournamentProvider>,
  document.getElementById('root')
);
					  	   