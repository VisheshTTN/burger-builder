import React from 'react';
import BuildControl from './BuildControl/BuildControl'
import classes from './BuildControls.css';

const controls = [
    {label:'Salad', type:'salad'},
    {label:'Bacon', type:'bacon'},
    {label:'Cheese', type:'cheese'},
    {label:'Meat', type:'meat'}
]

const buildControls = ( props ) => (
    <div className={classes.BuildControls}>
        <strong><p>Current Price: {props.price}$</p></strong>

        { 
            controls.map(ctrl=> (
                <BuildControl key={ctrl.label}
                label={ctrl.label}
                add={() => props.addIngredients(ctrl.type)} 
                remove={() => props.removeIngredients(ctrl.type)}
                disable={props.disabled[ctrl.type]} />
            ))
        }

        <button className={classes.OrderButton} disabled={!props.purchasable} onClick={props.ordered}>Order Now</button>
    </div>
);

export default buildControls;