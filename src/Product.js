import React, { Component } from 'react';
import {FormGroup, Input, Label, Modal, ModalHeader, ModalFooter, ModalBody, Table, Button} from 'reactstrap';
import Axios from 'axios';


class Product extends Component {
  state = {
    products: [],
    newProductData: {
      productType: '',
      price: 0.0
    },
    newProductModal : false
  }

  componentDidMount(){
    Axios.get('https://localhost:44345/api/Products').then((response) =>{
      this.setState({
        products: response.data
      })
    });
  }

  toggleNewProductModal(){
    this.setState({
      newProductModal : !this.state.newProductModal
    })

  }

  async addProduct(){
    const url = 'https://localhost:44345/api/Products';
    return  await Axios(url, {
      method: 'POST',
      headers: {
      'content-type': 'application/json'
    },    
     data : this.state.newProductData
    }).then((response) => {
      console.log(response.data);
    }, (error) => {
      console.log(error);
    }
    );
  }

  render(){

    let products = this.state.products.map((product) =>{
      return (

        <tr key={product.id}>
              {/* <td>{product.id}</td> */}
              <td>{product.productType}</td>
              <td>{product.price}</td>
              <td>
                <Button color="success" size="sm" className="mr-2">Edit</Button>
                <Button color="danger" size="sm">Delete</Button>
              </td>
              </tr>
      )
    })
    return (
      <div className="App container">

              <Button className="my-3" color="primary" onClick={this.toggleNewProductModal.bind(this)}>Add a new product</Button>
      <Modal isOpen={this.state.newProductModal} toggle={this.toggleNewProductModal.bind(this)}>
        <ModalHeader toggle={this.toggleNewProductModal.bind(this)}>Add a new product</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="productType">Product</Label>
            <Input id="productType" value={this.state.newProductData.productType} onChange={(e) => {
              let {newProductData} = this.state;

              newProductData.productType = e.target.value;

              this.setState({newProductData});
            }} />
        </FormGroup>
        <FormGroup>
          <Label for="price">Price</Label>
          <Input id="price" value={this.state.newProductData.price} onChange={(e) => {
              let {newProductData} = this.state;

              newProductData.price = e.target.value;

              this.setState({newProductData});
            }}/>
        </FormGroup>
          
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.addProduct.bind(this)}>Add Product</Button>{' '}
          <Button color="secondary" onClick={this.toggleNewProductModal.bind(this)}>Cancel</Button>
        </ModalFooter>
      </Modal>
        <Table>
          <thead>
            <tr>
              {/* <th>Id</th> */}
              <th>Producttype</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products}
          </tbody>
        </Table>

      </div>
    );
  }
}

export default Product;
