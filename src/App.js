import React, { Component} from 'react';
import Customer from './Customer'
import CustomerDetails from './CustomerDetails'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import MyContext from './MyContext';


class App extends Component {
  state = {
    customerId: null,
    setCustomerId: this.setCustomerId,
    customer: {},
    setCustomer: this.setCustomer,
  }

  setCustomerId = (customerId) => {
    this.setState({customerId});
  };

  setCustomer = (customer) => {
    this.setState({customer});
  };

  render(){
    return (
      <Router>
        <MyContext.Provider value={this.state}>
      <div className="App container">
        <Switch>
              <Route exact path='/' component={Customer} />
              <Route path='/customerdetails/:id' component={CustomerDetails} />
        </Switch>

      </div>
      {/* <Product></Product> */}
      </MyContext.Provider>  
      </Router>

    );
  }
}

export default App;
