class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {'tournament': this.context.tournament, 'errors': ''}
	}
	
	handleChange(evt, idx) {
		let tournament = Object.assign({}, this.state.tournament)
		tournament.rounds[idx][evt.target.name] = evt.target.value;
		this.setState({tournament: tournament});
	}
	
	titleChange(evt) {
		let tournament = Object.assign({}, this.state.tournament)
		tournament.name = evt.target.value;
		this.setState({tournament: tournament});
	}
	
	/**
	 * Event listener for the number of rounds control
	 */
	roundsChange(evt) {
		let target = evt.target;
		if(target.value > 0 && target.value < 51) {
			let tournament = Object.assign({}, this.state.tournament)
			if(target.value > tournament.rounds.length) {
				for(var i = tournament.rounds.length ; i < target.value ; i ++) {
					tournament.rounds.push({based_on: i, round_no: i + 1,
						pairing_system: 'SWISS', spread_cap: 1000})
				}
			}
			else {
				tournament.rounds = tournament.rounds.slice(target.value)
			}
			this.setState({'tournament': tournament})
		}
		else {
			this.setState({'errors': 'The number of rounds should be less than 50 and more than 0'})
		} 
	}
	
	ratedChanged(evt) {
		let tournament = Object.assign({}, this.state.tournament)
		tournament.rated = evt.target.value;
		this.setState({'tournament': tournament})
	}

	dateChange(evt) {
		let tournament = Object.assign({}, this.state.tournament)
		tournament.start_date = evt.target.value;
		this.setState({'tournament': tournament})
	}
	
	submitForm(evt) {
		evt.preventDefault();
		this.props.updateTournament(evt, this.state.tournament);
	}
	
	render() {
		if(this.state.tournament.rounds) {
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