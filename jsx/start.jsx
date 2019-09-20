const elem = document.getElementById('root') 

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

class Importer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {uploading: 0, file: null, message: ''}
	}
	
	onChangeHandler(e) { 
		this.setState({file : e.target.files[0] })
		console.log(e.target.files[0])
	}
	
	onClickHandler(e) { 
		if(this.state.file !== null) {
			 const data = new FormData() 
			 data.append('upload', this.state.file)
			 this.setState({uploading: 1})
			 axios.post("/api/upload/", data, {
			      headers: {
			           'content-type': 'multipart/form-data'
			      }
			 }).then(res => { // then print response status
				 this.setState({uploading: 2})
			 }).catch(err => { // then print response status
				 this.setState({uploading: 3})
			 })
		}
		else {
			setMessage('Please choose either your Anagrams.db or Hooks.db file')
		}
    }
	
	render() {
		return (
		   <div>
		      <input type="file" name="file" onChange={e => this.onChangeHandler(e)} className='form-control'/>
		      <button type="button" className="btn btn-success btn-block" onClick={e => this.onClickHandler(e)}>Upload</button>
		      <div>{this.state.message}</div>
		   </div>)
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

    render() {
    	return(
    		<Router>
    			 <Route path="/" exact render={ props=> <Tournaments tournaments={this.state.tournaments}/>  }  />
    		     <Route path="/tournament/" component={Main}  />
   	  			 <Route path="/import/" component={Importer}  />
 				 <Route path="/new/" render={ props => <Settings/> }  />
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
					  	   