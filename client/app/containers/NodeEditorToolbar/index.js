/*
 *
 * NodeEditorToolbar
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import {HotKeys} from 'react-hotkeys';
import moment from 'moment'

import { FlatButton } from '../../components/button'

import SavedState from '../../containers/SavedState'
import Spinner from '../../components/Spinner'

import './styles.scss'

import EditableTitle from '../../components/EditableTitle'
import NodeCollectionList from '../../containers/NodeCollectionList'

const DeleteButton = (props) => (
    <FlatButton iconName="trash" className="deleteButton" {...props} />
)

const NodeTitle = ({ title, updateNode }) => (
    <EditableTitle 
        title={title}
        updateNode={updateNode}
    />
)
const NodeSubtitle = ({ node }) => (
    <span className="nodeToolbar-subtitle">
        { moment.unix(node.modified / 1000).fromNow() } 
    </span>   
)

export class NodeEditorToolbar extends React.Component {
    constructor(props) {
        super(props)

        this.removeNode = this.removeNode.bind(this)
        this.exploreNode = this.exploreNode.bind(this)
        this.addRelation = this.addRelation.bind(this)
        this.toGraphView = this.toGraphView.bind(this)
        this.focusNode = this.focusNode.bind(this)
    }

    removeNode() {
        const result = window.confirm(`Are you sure you want to remove '${this.props.node.name}'`)
        if (result) {
            this.props.removeNode(this.props.node.id)
            this.props.history.push({
                pathname: `/app/nodes`,
                search: this.props.location.search
            })
        }
    }

    addRelation() {
        this.props.showAddRelationWindow(this.props.node.id)
    }

    exploreNode() {
        this.props.history.push({
            pathname: `/app/nodes/${this.props.id}`,
            search: this.props.location.search
        })
    }

    toGraphView() {
        const { history, page, id } = this.props

        history.push({
            pathname: `/app/nodes/${id}/graph`,
            search: this.props.location.search
        })
    }

    focusNode() {
        this.props.history.push({
            pathname: `/app/nodes/${this.props.id}/graph`,
            search: this.props.location.search
        })
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.isLoading) {
            return false;
        }

        return true;
    }

    render() {
        const { node, isLoading } = this.props

        // keymapping handlers, see App.js
        const handlers = {
            'explore': this.exploreNode,
            'addRelation': this.addRelation,
            'trash': this.removeNode,
        }

        if (!node) {
            return null;
        }

        return (
            <HotKeys focused={true} attach={document.getElementById('root')} handlers={handlers} className="nodeToolbar">
                    <div className="nodeToolbar-loadingState">
                    </div>
                    <div className="nodeToolbar-title">
                        <NodeTitle
                            title={node.name} 
                            updateNode={this.props.updateNode.bind(this, node.id)}
                        />
                        <NodeSubtitle
                            node={node}
                        />
                    </div>
                    <div>
                        {
                            node.type !== "root" ? 
                                <NodeCollectionList
                                    node={node}
                                    collections={this.props.collections}
                                    rootCollectionId={this.props.rootCollectionId}
                                    visible={node.type !== "root"}
                                />
                                : null
                        }
                    </div>
                    <div className="nodeToolbar-actions">
                        <DeleteButton
                            onClick={this.removeNode}
                            disabled={node.type === "root"}
                            label=""
                        />
                    </div>
            </HotKeys>
        );
    }
}

import { getNode, getParents } from '../../reducers'
import { updateNode, removeNode, removeEdge } from '../../actions/node'
import { showAddRelationWindow } from '../../actions/ui'

function mapStateToProps(state, props) {
    const rootCollectionId = state.user.rootCollectionId

    return {
        collections: getParents(state, props.id),
        rootCollectionId,
    }
}

export default withRouter(connect(mapStateToProps, {
    updateNode,
    removeNode,
    removeEdge,
    showAddRelationWindow
})(NodeEditorToolbar))
