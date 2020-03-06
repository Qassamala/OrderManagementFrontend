import React, { Component } from 'react';
import Order from './Order';
import MyContext from './MyContext';




class CustomerDetails extends Component {
    static contextType = MyContext;

    onNavigate = () => {
        
        this.props.history.push("/")
    
    };

    render(){

        return(
        <div>
            <button onClick={this.onNavigate} className="btn btn-primary">Go back button</button>
                        
            <MyContext.Consumer>
            { 
             props => {
            return <Order customerId={this.context.customerId}></Order> 
            }
            }
            </MyContext.Consumer>
        </div>            
        )  
    }    
}  
  export default CustomerDetails;
  