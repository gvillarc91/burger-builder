import React, {Component} from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxx/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as burgerBuilderActions from '../../store/actions/index';
import axios from '../../axios-orders';


class BurgerBuilder extends Component{

    state = {
        purchaising: false,
    }

    componentDidMount(){
      this.props.onInitIngredients();
    }

    updatePurchaseState(ingredients){

        const sum = Object.keys(ingredients)
                .map(igKey => {
                    return ingredients[igKey];
                })
                .reduce((sum,el) =>{
                    return sum + el;
                 }, 0);

       return sum > 0;
    }

    purchaseHandler = () => {
        this.setState({purchaising: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchaising: false});
    }

     purchaseContinueHandler = () => {

        //BEFORE REDUX
        //     const queryParams = [];
        //     for(let i in this.state.ingredients){
        //         queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        //     }
        //     queryParams.push('price=' + this.state.totaltotalPrice);
        //     const queryString = queryParams.join('&');

        //     this.props.history.push({
        //         pathname: '/checkout',
        //         search: '?' + queryString
        //     });
        this.props.history.push('/checkout');
     }

    render(){
        const disabledInfo = {
            ...this.props.ings
        };

        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary = null;
        let burger = this.props.error?<p>Ingredients can't be loaded!</p> : <Spinner />;

        if(this.props.ings){
                    burger = (
                        <Aux>
                                <Burger ingredients={this.props.ings} />
                                <BuildControls 
                                    ingredientAdded={this.props.onIngredientAdded}
                                    ingredientRemoved={this.props.onIngredientRemoved}
                                    disabled={disabledInfo}
                                    price={this.props.price}
                                    ordered={this.purchaseHandler}
                                    purchasable ={this.updatePurchaseState(this.props.ings)} />
                        </Aux>
                    );
                    orderSummary = <OrderSummary 
                        ingredients={this.props.ings} 
                        price= {this.props.price.toFixed(2)}
                        purchaseCanceled={this.purchaseCancelHandler}
                        purchaseContinue={this.purchaseContinueHandler} />;
        }
 
        return (
            <Aux>
              <Modal show={this.state.purchaising} modalClosed={this.purchaseCancelHandler}>
                     {orderSummary}
              </Modal>
              {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice,
        error: state.error
    };
}

const mapDispatchToProps = dispatch => {
    return{
        onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));