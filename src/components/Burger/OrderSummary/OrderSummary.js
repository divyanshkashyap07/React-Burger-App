import React from "react";
import Aux from "../../../hoc/Aux/Aux";
import Button from "../../../components/UI/Button/Button";

const orderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients)
        .map(igkey => {
            return (
                <li key={igkey}>
                    <span style={{textTransform: 'capitalize'}}>{igkey}</span> {props.ingredients[igkey]}
                </li>);
        });
    return (
        <Aux>
            <h3>Your Order</h3>
            <p>A delicious burger with following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p><strong>Total Price: {props.price.toFixed(2)}</strong></p>
            <p>Continue to Checkout?</p>
            <Button buttonType={"Danger"} clicked={props.purchaseCancel} >CANCEL</Button>
            <Button buttonType={"Success"} clicked={props.purchaseContinue} >CONTINUE</Button>
        </Aux>
    )
}

export default orderSummary;