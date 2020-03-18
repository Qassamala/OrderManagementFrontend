import React, { Component } from 'react';
import {FormGroup, Input, Label, Modal, ModalHeader, ModalFooter, ModalBody, Table, Button,} from 'reactstrap';
import Axios from 'axios';
import MyContext from './MyContext';




class Customer extends Component {
  constructor(props){
    super(props);
      this.state = {
        
        customers: [],
        newCustomerData: {
            name: '',
          customerType: ''
        },
        editCustomerData: {
            id: null,
            name: '',
          customerType: ''
        },
        newCustomerModal : false,
        editCustomerModal : false
    
      };

  }
  static contextType = MyContext;


 async componentDidMount(){
    await Axios.get('https://localhost:44345/api/Customers').then((response) =>{
      console.log(response.data)
       this.setState({
        customers: response.data
        

      })
    });
  console.log(this.state.customers)

  }
  

  toggleNewCustomerModal(){
    this.setState({
      newCustomerModal : !this.state.newCustomerModal
    })

  }

  toggleEditCustomerModal(){
    this.setState({
      editCustomerModal : !this.state.editCustomerModal
    })

  }

  async addCustomer(){
    const url = 'https://localhost:44345/api/Customers';
    return  await Axios(url, {
      method: 'POST',
      headers: {
      'content-type': 'application/json'
    },    
     data : this.state.newCustomerData
    }).then((response) => {
        let {customers} = this.state;
      customers.push(response.data);

    this.setState({customers, newCustomerModal: false, newCustomerData : {
        name: '',
        customerType: ''
    }});

    }, (error) => {
      console.log(error);
    }
    );
  }

    editCustomer(id, name, customerType){
     this.setState({
        editCustomerData: { id, name, customerType}, editCustomerModal: !this.state.editCustomerModal
    });

  }

  updateCustomer(){
      Axios.put('https://localhost:44345/api/Customers/' + this.state.editCustomerData.id, this.state.editCustomerData)
      .then((response) => {
        this._refreshCustomerList();

        this.setState({
            editCustomerModal: false, editCustomerData: {id: null, name: '', customerType: '' }
        })
    }); 
  }

  _refreshCustomerList(){
  console.log(this.state.customers)

    Axios.get('https://localhost:44345/api/Customers').then((response) =>{
        this.setState({          
          customers: response.data
        })
      });
  }

  deleteCustomer(id){
    Axios.delete('https://localhost:44345/api/Customers/' + id)
    .then((response) => {
      this._refreshCustomerList();
  }); 
}

async setContextCustomerId(id){

  return(
    <MyContext.Consumer>
      setCustomerId => (
      {this.context.customerId=id}
      )
    </MyContext.Consumer>
  )


}
async setContextCustomer(customer){
  console.log(this.context.customer)


  return(
    <MyContext.Consumer>
      customer => (
        {this.context.customer = customer}
        {console.log(this.context.customer)}
      )
    </MyContext.Consumer>
  )
}


async detailsCustomer(id, customer) {

  await this.setContextCustomerId(id);

  await this.setContextCustomer(customer);

  
  await this.setState({customerId: id})

  console.log(this.state.customerId, 'customerId');
  console.log(this.context.customerId, 'ContextcustomerId');
  console.log(this.context.customer, 'Contextcustomer');


  this.props.history.push("/CustomerDetails/" + id)
}


  render()  {
    console.log(this.state.customers);

    let customers = this.state.customers.map((customer) =>{
      return (
        
          
        <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.customerType}</td>
              <td>
                <Button color="success" size="sm" className="mr-2" onClick={this.editCustomer.bind(this, customer.id, customer.name, customer.customerType)}>Edit</Button>
                <Button color="success" size="sm" className="mr-2" onClick={this.detailsCustomer.bind(this, customer.id, customer)}>Details</Button>
                <Button color="danger" size="sm" onClick={this.deleteCustomer.bind(this, customer.id)}>Delete</Button>
              </td>
              </tr>
      )
    })


    return (

      <div className="App container">

              <Button className="my-3" color="primary" onClick={this.toggleNewCustomerModal.bind(this)}>Add a new customer</Button>
      <Modal isOpen={this.state.newCustomerModal} toggle={this.toggleNewCustomerModal.bind(this)}>
        <ModalHeader toggle={this.toggleNewCustomerModal.bind(this)}>Add a new customer</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="customerType">Customer Type</Label>
            <Input type="select" name="customerType" placeholder="Select customer type" id="customerType" value={this.state.newCustomerData.customerType} onChange={(e) => {
              let {newCustomerData} = this.state;

              newCustomerData.customerType = e.target.value;

              this.setState({newCustomerData});
            }}>
                <option>Small Company</option>
                <option>Large Company</option>
                <option>Private Customer</option>
                </Input>
        </FormGroup>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input id="name" value={this.state.newCustomerData.name} onChange={(e) => {
              let {newCustomerData} = this.state;

              newCustomerData.name = e.target.value;

              this.setState({newCustomerData});
            }}/>
        </FormGroup>          
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.addCustomer.bind(this)}>Add Customer</Button>{' '}
          <Button color="secondary" onClick={this.toggleNewCustomerModal.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={this.state.editCustomerModal} toggle={this.toggleEditCustomerModal.bind(this)}>
        <ModalHeader toggle={this.toggleEditCustomerModal.bind(this)}>Edit customer</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="customerType">CustomerType</Label>
            <Input type="select" name="customerType" id="customerType" value={this.state.editCustomerData.customerType} onChange={(e) => {
              let {editCustomerData} = this.state;

              editCustomerData.customerType = e.target.value;

              this.setState({editCustomerData});
            }}>
                <option>Small Company</option>
                <option>Large Company</option>
                <option>Private Customer</option>
                </Input>
            </FormGroup>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input id="name" value={this.state.editCustomerData.name} onChange={(e) => {
              let {editCustomerData} = this.state;

              editCustomerData.name = e.target.value;

              this.setState({editCustomerData});
            }}/>
        </FormGroup>
          
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.updateCustomer.bind(this)}>Update</Button>{' '}
          <Button color="secondary" onClick={this.toggleEditCustomerModal.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>
        <Table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>CustomerType</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers}
          </tbody>
        </Table>

        <div>
    <MyContext.Consumer>
      {      
      props => {
        return <h3>Test Context Id: {this.context.customerId}</h3>
        
      }
      }
    </MyContext.Consumer>
    </div>
        
      </div>
    );

  }
  
}


export default Customer;
