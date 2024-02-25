import { FormEvent } from 'react';

import TextField from '@mui/material/TextField/TextField';

import styles from './spinbutton.module.css';
import { validateInput } from './WeightTrackingSpinbuttonAlgorithms';
import { Props } from './WeightTrackingSpinbuttonInterface';

const WeightTrackingSpinbutton: React.FC<Props> = ({ defaultValue, displayUnit, name, label, disabled=false }) => {
    return (
        <div className={`w-48 mb-5 ${ styles.weightUnitWrapper } ${ styles[displayUnit] }` }>
            <TextField
                disabled= { disabled}
                name={ name }
                label={ label }
                type="number"
                className="w-full"
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps= {{
                    step: 0.01,
                    min: 10,
                    max: 1000
                }}
                defaultValue={ defaultValue.toFixed(2) }
                onInput={ (e: FormEvent<HTMLInputElement>) => validateInput(e) }
                key={ defaultValue }
            />
        </div>
    )
}

export default WeightTrackingSpinbutton;
