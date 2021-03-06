import _ from 'lodash'
import React from 'react'

import './styles.css'

export function controlled(InputComponent) {
    /*
     * HOF for creating a controlled input
     * // TODO: should this also merge in value prop if set? - 2016-08-05
    */
    class ControlledInput extends React.Component {
        constructor(props) {
            super(props)
            this.onChange = this.onChange.bind(this)

            this.state = { value: props.value || '' }
        }

        // componentWillReceiveProps(nextProps) {
        //     if (nextProps.value !== this.state.value) {
        //         this.setState({ value: nextProps.value })
        //     }
        // }

        onChange(event) {
            event.persist()

            if (this.props.onChange) {
                this.props.onChange(event)
            }

            this.setState({value: event.target.value})
        }

        render() {
            return (
                <InputComponent 
                    {...this.props} 
                    value={this.state.value} 
                    onChange={this.onChange} 
                />
            )
        }
    }

    return ControlledInput
}

export function debounced(Component, timeout=1000) {
    /*
     * HOF for creating a debounced onChange method
    */

    class DebouncedComponent extends React.Component {
        constructor(props) {
            super(props)

            this.onChange = this.onChange.bind(this)
            this.debounced = _.debounce(props.debouncedOnChange, timeout)
        }

        cancel() {
            /*
             * Public method to cancel debounce
            */
           this.debounced.cancel()
        }

        onChange(event) {
            event.persist()

            if (this.props.onChange) {
                this.props.onChange(event)
            }

            this.debounced(event)
        }
    
        render() {
            const { debouncedOnChange, ...restProps } = this.props
            return (
                <Component {...restProps} onChange={this.onChange} />
            )
        }
    }

    return DebouncedComponent
}

const Input = (props) => <input {...props} />
export const InputText = (props) => (
    <Input type='text' className={"input"} {...props} />
)
export const InputNumber = (props) => (
    <Input type="number" {...props} />
)


import TextField from 'material-ui/TextField'
export TextField from 'material-ui/TextField'


export const ControlledTextField = controlled(TextField)

export const DebouncedTextField = debounced(controlled(TextField))
export const DebouncedTextField500 = debounced(controlled(TextField), 500)
