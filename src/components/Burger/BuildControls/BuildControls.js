import React from 'react';

import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
    { label: 'Salad', type: 'salad'},
    { label: 'Cheese', type: 'cheese'},
    { label: 'Bacon', type: 'bacon'},
    { label: 'Meat', type: 'meat'}
];

const buildControls = (props) => (
    <div className={classes.BuildControls}>
    <p>Current Price:<strong> {props.price.toFixed(2)}</strong></p>
     {controls.map(cntrl => (
         <BuildControl 
                key= {cntrl.label} 
                label={cntrl.label} 
                added={() => props.ingredientAdded(cntrl.type)}
                removed={() => props.ingredientRemoved(cntrl.type)}
                disabled={props.disabled[cntrl.type]} />
     ))}
    </div>
);

export default buildControls;