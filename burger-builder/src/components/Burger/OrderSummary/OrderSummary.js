import React, { Component } from 'react';
import Aux from '../../../hoc/Aux';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component{

    componentDidUpdate(){
        console.log('OrderSummary did update')
    }
    
    render(){

        const ingredientSummary = Object.keys(this.props.ingredients)
        .map(igKey=>{return <li key={igKey}><span style={{textTransform: 'capitalize'}}>{igKey}</span>: {this.props.ingredients[igKey]} </li>});


        return(
            <Aux>
            <h3>Your Order</h3>
            <p>A delicious burger with following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p><strong>Total Price: {this.props.price}</strong></p>
            <p>Continue to checkout?</p>
            <Button btnType="Danger" clicked={this.props.cancelPurchase}>Cancel</Button>
            <Button btnType="Success" clicked={this.props.continuePurchase}>Continue</Button>
        </Aux>
        );
    }
}


export default OrderSummary;