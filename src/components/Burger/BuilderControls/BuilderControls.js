import React from "react";
import classes from "./BuilderControls.module.css";
import BuilderControl from "./BuilderControl/BuilderControl";

const controls = [
    { label: 'Salad', type: 'salad' },
    { label: 'Bacon', type: 'bacon' },
    { label: 'Cheese', type: 'cheese' },
    { label: 'Meat', type: 'meat' },
] 

const buildControls = (props) => {
    return (
        <div className={classes.BuildControls}>
            <p>Current Price: <strong>{props.price.toFixed(2)}</strong></p>
            {controls.map(control => {
                return <BuilderControl 
                    key={control.label} 
                    label={control.label}
                    add={() => props.addIngredients(control.type)} 
                    del={() => props.deleteIngredients(control.type)}
                    disabled={props.disabled[control.type]} />
            })}
            <button 
                className={classes.OrderButton} 
                onClick={props.ordered}
                disabled={props.purchasable}>ORDER NOW</button>
        </div>
    )
}

export default buildControls;