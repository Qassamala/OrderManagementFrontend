import React, { Component } from 'react';
import Order from './Order';
import MyContext from './MyContext';




class CustomerDetails extends Component {
    // constructor(props){
    //     super(props);
    // }
    static contextType = MyContext;

    onNavigate = () => {
        
        this.props.history.push("/")
    
    };

    render(){

        return(
        <div>
                        
            <MyContext.Consumer>
            { 
             props => {
                 return <Order customerId={this.context.customerId}></Order> 
                }
            }
            </MyContext.Consumer>
            <p></p>
            <button onClick={this.onNavigate} color="green">Go back button</button>
        </div>            
        )  
    }    
}  
  export default CustomerDetails;
  