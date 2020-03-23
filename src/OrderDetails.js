import React, { Component } from 'react';
import {FormGroup, Input, Label, Modal, ModalHeader, ModalFooter, ModalBody, Table, Button,} from 'reactstrap';
import Axios from 'axios';
import MyContext from './MyContext';

class OrderDetails extends Component {
    static contextType = MyContext;
    constructor(props){
      super(props);
      this.state = {
          products: [],
          orderRows: []
      }
      this.editOrder = this.editOrder.bind(this);
      this.deleteOrder = this.deleteOrder.bind(this);

    //   this.detailsOrder = this.detailsOrder.bind(this);

    }
    async componentDidMount(){
        console.log(this.props.orderId)
        await Axios.get('https://localhost:44345/api/Products').then((response) =>{
           this.setState({
            products: response.data,
          })
        });
        console.log(this.state.products)
        await Axios.get('https://localhost:44345/api/Orders/OrderRows/' + this.props.orderId).then((response) =>{
          console.log(response.data)      
          this.setState({
            orderRows: response.data
          })
        }); 
      }

      editOrder(id, totalSum, totalDiscount, rows){
        this.setState({
           editOrderData: { id, totalSum, totalDiscount, rows}, editOrderModal: !this.state.editOrderModal
       });
     }

     deleteOrder(id){
        Axios.delete('https://localhost:44345/api/Orders/' + id)
        .then((response) => {
          this._refreshOrdersList();
      }); 
    }
    
  
  render(){

    let orderRows = this.state.orderRows.map((orderRow) =>{
        return (
          <tr key={orderRow.id}>
                {/* <td>{orderRow.id}</td> */}
                <td>{this.state.products.find(p => p.id === orderRow.productId).productType}</td>
                <td>{orderRow.quantity}</td>
                <td>{orderRow.totalSum}</td>
                <td>{orderRow.totalDiscount}</td>
                <td>
                  <Button color="success" size="sm" className="mr-2" onClick={this.editOrder.bind(this, orderRow.id, orderRow.totalSum, orderRow.totalDiscount)}>Edit</Button>
                  <Button color="danger" size="sm" onClick={this.deleteOrder.bind(this, orderRow.id)}>Delete</Button>
                </td>
                </tr>
        )
      })

      return <div>
          <p></p>
          <h3>Order details for orderId: {this.props.orderId} </h3>
          <Table>
          <thead>
            <tr>
              {/* <th>Order Id</th> */}
              <td>Product</td>
              <td>Quantity</td>
              <th>Total Sum</th>
              <th>Total Discount</th>            
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orderRows}

          </tbody>
        </Table>
          


      </div>
  }


  
  
  }

  export default OrderDetails;