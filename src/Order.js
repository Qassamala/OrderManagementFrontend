import React, { Component } from 'react';
import {FormGroup, Input, Label, Modal, ModalHeader, ModalFooter, ModalBody, Table, Button,} from 'reactstrap';
import Axios from 'axios';
import MyContext from './MyContext';


class Order extends Component {
  static contextType = MyContext;
  // constructor(props) {
  //   super(props);
  //   this.product = null    
  // }

  state = {
    customers: [],
    customer: {
      name: '',
      customerType: ''
    },
    discount: 0.1,
    product: {
      productId: '',
      productType: '',
      productPrice: ''
    },  
    products: [],
    customerId: this.props.customerId, //props or state? semms to be props, repercussions, can this change due to multiple users using this app on teh same db
    orders: [],
    newOrderData: {
        customerId: this.props.customerId,
        totalSum: '',
        totalDiscount: '',
        rows: []
    },
    newOrderRowData:{
      productId: null,
      singleProductPrice: null,
      quantity: null,
	    totalSum: null,
	    totalDiscount: null,
	    orderId: null

    },
    editOrderData: {
        id: null,
        customerId: '',
        totalSum: '',
        totalDiscount: '',
        rows: []
    },
    newOrderModal : false,
    editOrderModal : false

  }

  async componentDidMount(){
    await Axios.get('https://localhost:44345/api/Products').then((response) =>{
       this.setState({
        products: response.data
      })
    });
    this.setCustomersState();
    
  }

  // async componentWillMount(){   
  //   await Axios.get('https://localhost:44345/api/Orders/customer/' + this.state.customerId).then((response) =>{
  //     this.setState({
  //       orders: response.data
  //     })
  //   });
  // }

  toggleNewOrderModal(){
    this.setState({
      newOrderModal : !this.state.newOrderModal
    })

  }

  toggleEditOrderModal(){
    this.setState({
      editOrderModal : !this.state.editOrderModal
    })

  }

  async addOrder(){
    const url = 'https://localhost:44345/api/Orders';
    return  await Axios(url, {
      method: 'POST',
      headers: {
      'content-type': 'application/json'
    },    
     data : this.state.newOrderData
    }).then((response) => {
        let {orders} = this.state;
      orders.push(response.data);

    this.setState({orders, newOrderModal: false, newOrderData : {
        customerId: '',
        totalSum: '',
        totalDiscount: '',
        rows: []
    }});

    }, (error) => {
      console.log(error);
    }
    );
  }

    editOrder(id, totalSum, totalDiscount, rows){
     this.setState({
        editOrderData: { id, totalSum, totalDiscount, rows}, editOrderModal: !this.state.editOrderModal
    });

  }

  updateOrder(){
      Axios.put('https://localhost:44345/api/Orders/' + this.state.editOrderData.id, this.state.editOrderData)
      .then((response) => {
        this._refreshCustomerList();

        this.setState({
            editOrderModal: false, editOrderData: {id: null, totalSum: '', totalDiscount: '', rows: [] }
        })
    }); 
  }

  _refreshOrdersList(){
    Axios.get('https://localhost:44345/api/Orders/customer/' + this.state.customerId).then((response) =>{
        this.setState({
          orders: response.data
        })
      });

  }

  deleteOrder(id){
    Axios.delete('https://localhost:44345/api/Orders/' + id)
    .then((response) => {
      this._refreshOrdersList();
  }); 
}

detailsOrder(id){
    // BrowserRouter.push("/CustomerDetails" + id);
}

onSelect = (e) => {

  const [productId, productType, productPrice] = e.target.value.split(',');

    this.setState({
      product:{
        productId,
        productType,
        productPrice,
      }
    });


    {this.product = this.state.products.find(p => p.productId === this.state.productId)}

    this.getDiscount();

}

getProductPrice = () => {

  return this.state.product.productPrice

}

setCustomersState(){
  return(
    

    <MyContext.Consumer>
      customers => (
        {this.state.customer = this.context.customers.find(c => c.id = this.state.customerId)}
        
     
    </MyContext.Consumer>
  )

}

getDiscount = () => {


  
  console.log(this.context.customers)
  console.log(this.state.customer)


    if(this.state.customer.customerType === "Large Customer" && (this.state.product.productType === 'Pen' ||this.state.product.productType === 'Paper' )){
      this.setState({
        discount: 0.3
      })
      console.log(this.state.discount)

    }
    else if(this.state.customer.customerType === "Private Customer"){
      this.setState({
        discount: 0.0
      })
    }
}

  render(){    
    

    let orders = this.state.orders.map((order) =>{
      return (
        <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customerId}</td>
              <td>{order.totalSum}</td>
              <td>{order.totalDiscount}</td>
              <td>
                <Button color="success" size="sm" className="mr-2" onClick={this.editOrder.bind(this, order.id, order.customerId, order.totalSum, order.totalDiscount)}>Edit</Button>
                <Button color="success" size="sm" className="mr-2" onClick={this.detailsOrder.bind(this, order.id)}>Details</Button>
                <Button color="danger" size="sm" onClick={this.deleteOrder.bind(this, order.id)}>Delete</Button>
              </td>
              </tr>
      )
    })
    return (
      <div className="App container">

              <Button className="my-3" color="primary" onClick={this.toggleNewOrderModal.bind(this)}>Add a new order</Button>
      <Modal isOpen={this.state.newOrderModal} toggle={this.toggleNewOrderModal.bind(this)}>
        <ModalHeader toggle={this.toggleNewOrderModal.bind(this)}>Add a new order</ModalHeader>
        <ModalBody>
          Price of {this.state.product.productType} is: {this.state.product.productPrice} SEK
          <p></p>

          Total Sum: {this.state.product.productPrice * this.state.newOrderRowData.quantity}
          <p></p>

          Total Discount: {(this.state.product.productPrice * this.state.newOrderRowData.quantity) * this.state.discount}
          <p></p>

          <FormGroup>
            <Label for="productType">Product</Label>
            <Input type="select" name="productType" placeholder="Select product" id="productType" onChange={this.onSelect.bind(this)}>
            
            {this.state.products.map((product) => (
              <option key ={product.id} value = {[product.id, product.productType, product.price]}>
                  {product.productType}
                </option>
             ))}          
            </Input>            
        </FormGroup>
        <FormGroup>
          <Label for="quantity">Quantity</Label>
          <Input type="number" min="1" placeholder="1" id="quantity" value={this.state.newOrderRowData.quantity} onChange={(e) => {
              let {newOrderRowData} = this.state;

              newOrderRowData.quantity = e.target.value;

              this.setState({newOrderRowData});
            }}/>
        </FormGroup>     
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.addOrder.bind(this)}>Add Order</Button>{' '}
          <Button color="secondary" onClick={this.toggleNewOrderModal.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>


      <Modal isOpen={this.state.editOrderModal} toggle={this.toggleEditOrderModal.bind(this)}>
        <ModalHeader toggle={this.toggleEditOrderModal.bind(this)}>Edit order</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="customerType">CustomerType</Label>
            <Input type="select" name="customerType" id="customerType" value={this.state.editOrderData.customerType} onChange={(e) => {
              let {editOrderData} = this.state;

              editOrderData.customerType = e.target.value;

              this.setState({editOrderData});
            }}>
                <option>Small Company</option>
                <option>Large Company</option>
                <option>Private Customer</option>
                </Input>
            </FormGroup>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input id="name" value={this.state.editOrderData.name} onChange={(e) => {
              let {editOrderData} = this.state;

              editOrderData.name = e.target.value;

              this.setState({editOrderData});
            }}/>
        </FormGroup>
          
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.updateOrder.bind(this)}>Update</Button>{' '}
          <Button color="secondary" onClick={this.toggleEditOrderModal.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>
        <Table>
          <thead>
            <tr>
              {/* <th>Id</th> */}
              <th>Name</th>
              <th>CustomerType</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders}

          </tbody>
        </Table>

      </div>
    );
  }
}

export default Order;