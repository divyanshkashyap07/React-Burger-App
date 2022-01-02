import React, {Component} from "react";
import Burger from "../../components/Burger/Burger";
import Aux from "../../hoc/Aux/Aux";
import BuilderControls from "../../components/Burger/BuilderControls/BuilderControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axis-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";

const INGREDIENTS_PRICES = {
    salad: 20,
    bacon: 40,
    cheese: 30,
    meat : 25
}

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 20,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount () {
        axios.get( 'https://react-my-burger-e62a5-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients/-MsQBu74ety6Av3Ycy5C/ingredients.json' )
            .then( response => {
                this.setState( { ingredients: response.data } );
            } )
            .catch( error => {
                this.setState( { error: true } );
            } );
    }

    purchasableHandler = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igkey => {
                return ingredients[igkey]
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        this.setState({purchasable: sum > 0});
    }

    addIngredientsHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const newCount = oldCount + 1;
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = newCount;
        const priceAddition = INGREDIENTS_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
        this.purchasableHandler(updatedIngredients);
    }

    deleteIngredientsHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const newCount = oldCount - 1;
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = newCount;
        const priceDeletion = INGREDIENTS_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeletion;
        this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
        this.purchasableHandler(updatedIngredients);
    }

    purchasingHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
         this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        //alert("You Continue!");
        this.setState({purchasing: true});
        this.setState({loading: true})
        const order = {
            ingredients: this.state.ingredients,
            customer: {
                Name: "TestUser",
                email: "test@test.com",
                phone: "12345"
            },
            delivery: "fast"
        }

        axios.post('/order.json', order)
            .then(response => {
                this.setState({loading: false, purchasing: false})
            })
            .catch(error => {
                this.setState({loading: false, purchasing: false})
            })
    }

    render() {
        const disabled = {
            ...this.state.ingredients
        };
        for (let key in disabled) {
            disabled[key] = disabled[key] <= 0;
        }

        let burger = this.state.error ? "Ingredients cant be loaded!" : <Spinner />;
        let order = null;

        if(this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                        <BuilderControls 
                            addIngredients={(type) => this.addIngredientsHandler(type)}
                            deleteIngredients={(type) => this.deleteIngredientsHandler(type)}
                            disabled={disabled}
                            purchasable={!this.state.purchasable}
                            ordered={this.purchasingHandler}
                            price={this.state.totalPrice} />
                </Aux>
            )
            order = <OrderSummary 
            ingredients={this.state.ingredients} 
            price={this.state.totalPrice}
            purchaseCancel={this.purchaseCancelHandler}
            purchaseContinue={this.purchaseContinueHandler} />;
        }
        
        if(this.state.loading) {
            order = <Spinner />
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} clicked={this.purchaseCancelHandler}>
                    {order}
                </Modal>
                {burger}
            </Aux>
        )
    }
}

export default withErrorHandler( BurgerBuilder, axios );