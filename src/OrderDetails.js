import React, { Component } from 'react';
import {FormGroup, Input, Label, Modal, ModalHeader, ModalFooter, ModalBody, Table, Button,} from 'reactstrap';
import Axios from 'axios';
import MyContext from './MyContext';

class OrderDetails extends Component {
    static contextType = MyContext;
    constructor(props){
      super(props);
      this.state = {
          discount: 0.1,
          products: [],
          product: {
            productId: '',
            productType: '',
            productPrice: ''
          },
          orderRows: [],
          newOrderData: {
            id: null,
            customerId: '',
            totalSum: '',
            totalDiscount: '',
            rows: []
        },
        editOrderData: {
            id: null,
            customerId: '',
            totalSum: '',
            totalDiscount: '',
            rows: []
        },
        editOrderRowData:{
            id: null,
            orderId: null,
            productId: null,
            singleProductPrice: null,
            quantity: null,
            totalSum: null,
            totalDiscount: null,
      
          },
        editOrderModal : false,
      }
      this.editOrder = this.editOrder.bind(this);
      this.deleteOrderRow = this.deleteOrderRow.bind(this);
      this._refreshOrderRowsList = this._refreshOrderRowsList.bind(this);

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
        console.log(this.state.orderRows)
      }

      toggleEditOrderModal(){
        this.setState({
          editOrderModal : !this.state.editOrderModal
        })
      }

      async editOrder(id, totalSum, totalDiscount){
          console.log(id, 'rowid')
        await this.setState({
            editOrderRowData: {
                id: id,
                orderId: this.props.orderId,
                totalSum: totalSum,
                totalDiscount: totalDiscount
            },
            editOrderModal: !this.state.editOrderModal
       });
       console.log(this.state.editOrderRowData, 'editOrderRowData')
       console.log(this.state.orderRows)

     }

     async updateOrder(){
        console.log(this.state.orderRows, 'this.state.orderRows')
        console.log(this.state.editOrderData, 'editorderdata')


        await Axios.put('https://localhost:44345/api/Orders/Update/' + this.state.editOrderData.id, this.state.editOrderData)
        .then((response) => {
          this._refreshOrderRowsList();          
      });
      this.setState({
        editOrderModal: false,
        editOrderData: {
         id: null,
         customerId: '',
         totalSum: '',
         totalDiscount: '',
         rows: []
      }});
       
    }
    
    async _refreshOrderRowsList(){
        console.log(this.state.orderRows)
      
        await Axios.get('https://localhost:44345/api/Orders/OrderRows/' + this.props.orderId).then((response) =>{
            console.log(response.data)      
            this.setState({
              orderRows: response.data
            })
          }); 
        }

     async deleteOrderRow(rowId){
         
        // If only one orderrow left, delete entire order
        if(this.state.orderRows.length < 2){

            Axios.delete('https://localhost:44345/api/Orders/' + this.props.orderId)
                .then((response) => {
                this._refreshOrderRowsList();
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

        var index = rows.findIndex(x => x.id === rowId);

        rows.splice(index, 1);

        let totalSum = null;
        rows.forEach(row => totalSum += row.totalSum)

        let totalDiscount = null;
        rows.forEach(row => totalDiscount += row.totalDiscount)

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

        Axios.put('https://localhost:44345/api/Orders/DeleteOrderRow/' + this.state.newOrderData.id, this.state.newOrderData)
        .then((response) => {
            console.log(response);
          this._refreshOrderRowsList();
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

    async onSelectProduct(e) {
        console.log(this.state.orderRows)
        
      
        const [productId, productType, productPrice] = e.target.value.split(',');
      
          await this.setState({
            product:{
              productId,
              productType,
              productPrice,
            }
          });
          console.log(this.state.product)
      
          //Set current discount rate based on customerType and Product currently selected    
          await this.setDiscount();
          
          await this.setEditOrderRowData();

        console.log(this.state.orderRows)
        console.log(this.state.editOrderRowData)

        await this.setEditOrderData();



      }

      setDiscount = () => {

        if(this.context.customer.customerType === "Large Company" && (this.state.product.productType === 'Pen' ||this.state.product.productType === 'Paper' )){
          this.setState({
            discount: 0.3
          })
          console.log(this.state.discount)
        }
        else if(this.context.customer.customerType === "Large Company" && (this.state.product.productType === 'Notebook' ||this.state.product.productType === 'Eraser' ) ){
          this.setState({
            discount: 0.1
          })
          console.log(this.state.discount)
        }
        else if(this.context.customer.customerType === "Private Customer"){
          this.setState({
            discount: 0.0
          })
          console.log(this.state.discount)
        }
    }

    async onSelectQuantity(e) {
        let quantity = e.target.value;
        
        console.log(quantity, 'quantity')
        await this.setState(prevState =>({
            editOrderRowData: { ...prevState.editOrderRowData, quantity: quantity }
        }));
      }

    setEditOrderRowData(){

        this.setState(prevState => ({
            editOrderRowData: { ...prevState.editOrderRowData,
               productId : this.state.product.productId,
               singleProductPrice : this.state.product.productPrice,
               totalSum : this.state.product.productPrice * this.state.editOrderRowData.quantity,
               totalDiscount : (this.state.product.productPrice * this.state.editOrderRowData.quantity) * this.state.discount
       }}));
 }

 async setEditOrderData(){

        const rows = await Object.assign([], this.state.orderRows);

        console.log(this.state.editOrderRowData.id)


        var index =  await rows.findIndex(x => x.id === this.state.editOrderRowData.id);
        
        console.log(index)
        console.log(rows[index])
        console.log(this.state.editOrderRowData)

        rows[index] = this.state.editOrderRowData;

        console.log(rows[index])

        console.log(rows)

        let totalSum = null;
        rows.forEach(row => totalSum += row.totalSum)

        let totalDiscount = null;
        rows.forEach(row => totalDiscount += row.totalDiscount)

        await this.setState(prevState => ({
            editOrderData: {
              ...prevState.editOrderData,
              id: this.props.orderId,
              customerId: this.context.customer.id,
              totalSum: totalSum,
              totalDiscount: totalDiscount,
              rows : rows
            }
          }));

          console.log(this.state.editOrderData)
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

            <Modal isOpen={this.state.editOrderModal} toggle={this.toggleEditOrderModal.bind(this)}>
        <ModalHeader toggle={this.toggleEditOrderModal.bind(this)}>Edit order</ModalHeader>
        <ModalBody>
        <FormGroup>
            <Label for="productType">Product</Label>
            <Input type="select" name="productType" placeholder="Select product" id="productType" onChange={this.onSelectProduct.bind(this)}>

            {this.state.products.map((product) => (
              <option key ={product.id} value = {[product.id, product.productType, product.price]}>
                  {product.productType}
                </option>
             ))},                      
            </Input>            
        </FormGroup>
        <FormGroup>
          <Label for="quantity">Quantity</Label>
          <Input type="number" min="1" placeholder="Select quantity" id="quantity" onChange={this.onSelectQuantity.bind(this)}></Input>
        </FormGroup> 
          
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.updateOrder.bind(this)}>Update</Button>{' '}
          <Button color="secondary" onClick={this.toggleEditOrderModal.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>
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