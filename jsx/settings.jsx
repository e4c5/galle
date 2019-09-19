/**
 * Tournament settings.
 * 
 * This includes the number of rounds, whether rated or not and the
 * pairing system used for each round.
 */
class Settings extends React.Component {
	static contextType = TournamentContext
	 
	constructor(props) {
		super(props);
		this.state = {errors: '', ready: false}
		
	}
	
	componentDidMount() {
		if(this.context.tournament !== null) {
			/* copying props into state is bad but we really do need this
			 * in order to be able to use the same component for create and update
			 */
			this.setState({tournament: {...this.context.tournament}, ready : true})
		}
		else {
			this.setState({tournament: {start_date:'', rounds:[], name:''}, ready: true})
		}
	}
	
	/**
	 * Change one of the round configurations.
	 */
	handleChange(evt, idx) {
		const rounds = [...this.state.tournament.rounds]
		rounds[idx][evt.target.name] = evt.target.value;

		this.setState({tournament: {...tournament, rounds: rounds}});
	}
	
	/**
	 * Event handler for title field 
	 */
	titleChange(evt) {
		this.setState({tournament: {...this.state.tournament, name: evt.target.value }});
	}
	
	
	/**
	 * Event listener for the number of rounds control
	 */
	roundsChange(evt) {
		let value = evt.target.value;
		if(value > 0 && value < 51) {
			const tournament = {...this.state.tournament }
			
			if(value > tournament.rounds.length) {
				for(var i = tournament.rounds.length ; i < value ; i ++) {
					tournament.rounds.push({based_on: i, round_no: i + 1,
						pairing_system: 'SWISS', spread_cap: 1000})
				}
			}
			else {
				tournament.rounds = tournament.rounds.slice(value)
			}
			this.setState({tournament: tournament})
		}
		else {
			this.setState({'errors': 'The number of rounds should be less than 50 and more than 0'})
		} 
	}
	
	/**
	 * Event handler for the rated checkbox
	 */
	ratedChanged(evt) {
		this.setState({tournament: {...this.state.tournament, rated: evt.target.value }});
	}

	/**
	 * event handler for the date field in the form
	 */
	dateChange(evt) {
		this.setState({tournament: {...this.state.tournament, start_date: evt.target.value }});
	}
	
	/**
	 * Sbmit the form.
	 */
	submitForm(evt) {
		evt.preventDefault();
		axios.post('/api/', this.context.tournament).then(
				response => { console.log("Tournament updated") });
	}
	
	render() {
		console.log("Settings")
		if(this.state.ready) {
			let button = null;
			if(this.state.tournament.rounds.length == 0 || this.state.tournament.name == '') {
				button = <input type='submit' className='btn btn-primary' value='Submit' disabled/>
			}
			else { 
				button = <input type='submit' className='btn btn-primary' value='Submit' /> 
			}	
			return(<div>
				{this.state.errors &&  <div className='alert alert-error'>{this.state.errors}</div>  }
					<form className="form" onSubmit={evt => this.submitForm(evt) }>
						<div className='row align-items-center'>
						    <div className='col-8'>
						       <input type='text' placeholder='Tournament name'
						     	 value={this.state.tournament.name} onChange={evt => this.titleChange(evt) } className='form-control' /></div>
						    <div className='col-1'>Date</div>
						    <div className='col-2'><input type='date' onChange={evt => this.dateChange(evt)} className='form-control' /></div>
						</div>
						
						<div className='row align-items-center'>
						 
						    <div className='col-2'>Number of rounds</div>
						    <div className='col-2'><input type="number" onChange={evt => this.roundsChange(evt)} className='form-control' /></div>
						    <div className="btn-group btn-group-toggle" data-toggle="buttons">
						       <label className="btn btn-secondary active">
						    	 <input type='radio' onChange={evt => this.ratedChanged(evt)} name='rated' checked /> Rated
						       </label>
						       <label className="btn btn-secondary">	 
						    	 <input type='radio' onChange={evt => this.ratedChanged(evt)} name='rated' /> Unrated
						       </label>
						    </div>
						</div>
						{this.state.tournament.rounds.map((item , idx) =>(
						  <div className='row align-items-center' key={item.round_no}>
						    <div className='col'><p>Round {item.round_no}</p></div>
						    <div className='col'>Based on</div>
						    <div className='col'>
						       <input type="integer" value={item.based_on} onChange={evt => this.handleChange(evt, idx)} name='based_on' className='form-control' /></div>
						    <div className='col'>Pairing System</div>
						    <div className='col'>
						      <select className='form-control' name='pairing_system' onChange={evt => this.handleChange(evt, idx)} >
						          <option value='SWISS'>Swiss</option>
						          <option value='ROUND_ROBIN'>Round Robin</option>
						          <option value='KOTH'>King of the hill</option>
						          <option value='Random'>Random</option>	
						      </select>
						    </div>
						    <div className='col'>Spread Cap</div>
						    <div className='col'>
						      <input type="integer" value={item.spread_cap} onChange={evt => this.handleChange(evt, idx)} className='form-control' />
						    </div>
						  </div>
					  ))}
						{button}
					</form>
				</div>)
		}
		else {
			return null;
		}
	}

}