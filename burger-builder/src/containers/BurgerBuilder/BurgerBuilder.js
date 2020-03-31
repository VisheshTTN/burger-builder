import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Loader from '../../components/UI/Loader/Loader';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENTS_PRICES = {
    salad: 0.4,
    bacon: 0.5,
    cheese: 1.3,
    meat: 1.5
};

class BurgerBuilder extends  Component{

    state= {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount(){
        axios.get('https://react-burger-builder-62c01.firebaseio.com/ingredients.json')
                .then(response=>{
                    this.setState({ingredients: response.data});
                })
                .catch(error=>{
                    this.setState({error: true});
                })
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
                    .map(igKey=>{return ingredients[igKey];}).reduce((sum, el)=>{return sum+el;}, 0);
        
        this.setState({purchasable: sum>0});
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = updatedCount; 

        const priceAddition = INGREDIENTS_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});

        this.updatePurchaseState(updatedIngredients);        
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];

        if(oldCount <= 0){
            return;
        }

        const updatedCount = oldCount - 1;
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = updatedCount; 

        const priceDeduction = INGREDIENTS_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});

        this.updatePurchaseState(updatedIngredients);     
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        //alert('ordered');
        this.setState({loading: true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Vishesh',
                address: {
                    street: 'teststreet',
                    city: 'testcity',
                    pin: 800888,
                    country: 'India'
                }
            },
            deliveryMode: 'fastest',
            payment: 'cash'
        };

        axios.post('/orders.json', order)
                .then(response=> { 
                    this.setState({loading: false, purchasing: false}); 
                })
                .catch(error=> { 
                    this.setState({loading: false, purchasing: false}); 
                 });

    }

    render(){
        const disabledInfo = {...this.state.ingredients};
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <=0
        }

        let orderSummary = null;
        let burger = this.state.error ? <p>Something didn't work!</p> : <Loader />;

        if(this.state.ingredients){
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls addIngredients={this.addIngredientHandler}
                                    removeIngredients={this.removeIngredientHandler}
                                    disabled={disabledInfo}
                                    price={this.state.totalPrice}
                                    purchasable={this.state.purchasable}
                                    ordered={this.purchaseHandler} />
                </Aux>
            );

            orderSummary = <OrderSummary ingredients={this.state.ingredients}
                                            cancelPurchase={this.purchaseCancelHandler}
                                            continuePurchase={this.purchaseContinueHandler}
                                            price={this.state.totalPrice} />;

        }

        if(this.state.loading){
            orderSummary = <Loader />
        }

        return(
            <Aux>
                <Modal show={this.state.purchasing} removeModal={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);