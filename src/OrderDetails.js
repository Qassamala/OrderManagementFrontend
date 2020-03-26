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
          orderRows: [],
          newOrderData: {
            id: null,
            customerId: '',
            totalSum: '',
            totalDiscount: '',
            rows: []
        },
      }
      this.editOrder = this.editOrder.bind(this);
      this.deleteOrderRow = this.deleteOrderRow.bind(this);
      this._refreshOrdersList = this._refreshOrdersList.bind(this);

    }
    async componentDidMount(){
        await Axios.get('https://localhost:44345/api/Products').then((response) =>{
           this.setState({
            products: response.data,
          })
        });

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

     updateOrder(){
        console.log(this.state.newOrderData)
        Axios.put('https://localhost:44345/api/Orders/OrderRow/' + this.state.newOrderData.orderId, this.state.newOrderData)
        .then((response) => {
          this._refreshOrdersList();          
      });
      this.setState({
        newOrderData: {
         orderId: null,
         customerId: '',
         totalSum: '',
         totalDiscount: '',
         rows: []
      }});
       
    }
    
    async _refreshOrdersList(){
        console.log(this.state.orderRows)
      
        await Axios.get('https://localhost:44345/api/Orders/OrderRows/' + this.props.orderId).then((response) =>{
            console.log(response.data)      
            this.setState({
              orderRows: response.data
            })
          }); 
        }

     async deleteOrderRow(rowId){

        if(this.state.orderRows.length < 2){

            Axios.delete('https://localhost:44345/api/Orders/' + this.props.orderId)
                .then((response) => {
                this._refreshOrdersList();
                });

                this.setState({
                    newOrderData: {
                     id: null,
                     customerId: '',
                     totalSum: '',
                     totalDiscount: '',
                     rows: []
                  }});

        }else {            
         
        //Calculate new total sum and total discount
        const rows = await Object.assign([], this.state.orderRows);

        console.log(rows);

        var index = rows.findIndex(x => x.id === rowId);

        console.log(index)

        // var index = await rows.indexOf(rowId);


        // var index = rows.map(x => {
        //     return x.Id;
        //   }).indexOf(rowId);

        console.log(rowId)

        rows.splice(index, 1);


        console.log(this.state.orderRows);

        console.log(rows);


        let totalSum = null;
        rows.forEach(row => totalSum += row.totalSum)

        let totalDiscount = null;
        rows.forEach(row => totalDiscount += row.totalDiscount)

        console.log(this.props.orderId)

        await this.setState(prevState => ({
            newOrderData: {
              ...prevState.newOrderData,
              id: this.props.orderId,
              customerId: this.context.customer.id,
              totalSum: totalSum,
              totalDiscount: totalDiscount,
              rows : rows
            }
          }));

        console.log(rowId)
        console.log(this.state.newOrderData)

        Axios.put('https://localhost:44345/api/Orders/' + this.state.newOrderData.id, this.state.newOrderData)
        .then((response) => {
            console.log(response);
          this._refreshOrdersList();
      });

      this.setState({
        newOrderData: {
         id: null,
         customerId: '',
         totalSum: '',
         totalDiscount: '',
         rows: []
      }});

        //   this.updateOrder();

    //     Axios.delete('https://localhost:44345/api/Orders/' + id)
    //     .then((response) => {
    //       this._refreshOrdersList();
    //   }); 

        }
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
                  <Button color="danger" size="sm" onClick={this.deleteOrderRow.bind(this, orderRow.id)}>Delete</Button>
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