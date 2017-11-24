import React from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react'
import classNames from 'classnames'

import './styles.scss'

class GraphModes extends React.Component {
    /*
    * On click, move graph in "selectNode" mode
    */
    constructor(props) {
        super(props)
    }

    render() {
        const { mode } = this.props

        const viewClass = classNames("graphMode-button", {
            "active": mode === "view"
        })
        const editClass = classNames("graphMode-button", {
            "active": mode === "edit"
        })
        const focusClass = classNames("graphMode-button", {
            "active": mode === "focus"
        })
        const expandClass = classNames("graphMode-button", {
            "active": mode === "expand"
        })
        const abstractClass = classNames("graphMode-button", {
            "active": mode === "abstract"
        })
        const deleteClass = classNames("graphMode-button", {
            "active": mode === "delete"
        })

        return (
                <Button.Group className="graphModes">
                    <Button
                        size="medium" className={ editClass }
                        onClick={ () => this.props.setGraphMode("edit") }
                        >
                            <Icon name="edit" /> <span>Edit</span>
                    </Button>

                    <Button
                        size="medium" className={ abstractClass }
                        onClick={ () => this.props.setGraphMode("abstract") }
                    >
                        <Icon name="location arrow" /> <span>Navigate</span>
                    </Button>
                    <Button
                        size="medium" className={ deleteClass }
                        onClick={ () => this.props.setGraphMode("delete") }
                        >
                        <Icon name="remove" /> <span>Remove</span>
                    </Button>
                </Button.Group>
        )
    }
}

import { setGraphMode } from '../../actions/ui'

export default connect((state) => ({ mode: state.graphUiState.mode }), {
    setGraphMode
})(GraphModes)
