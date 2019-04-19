import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import All from '../GameTabs/All';
import SFW from '../GameTabs/SFW';
import NSFW from '../GameTabs/NSFW';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import requireAuth from '../../../containers/requireAuth';
import CreateGameModal from '../../../containers/CreateGameModal';
import hostname from '../../../config/config';

const socket = io(hostname, {
    transports: ['websocket'],
    secure: true
});

class GamesLobby extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showCreatedGame: false
        }
    }

    state = {
        key: 'allGames'
    }
    
    componentDidMount = () => {
        // fetch games
        this.props.getAllGames();
        // on new game added re fetch
        socket.on('game added', () => {
            this.props.getAllGames();
        });
        // on user left update games
        socket.on('update games', () =>{
            this.props.getAllGames();
        });
    }

    handleNewGame = () => {
        this.props.createGame((response) => {
            const game = response.data.game;
            console.log(game._id);
            this.props.history.push('/room/' + game._id);
        });
    }

    handleClickCreate = () => {
        console.log('show modal');
        this.setState({ showCreateGame: true });
    }

    render() {
        const closeCreateGame = () => this.setState({ showCreateGame: false });
        if (this.props.loading) {
            return <div>Loading...</div>;
        }
        return (
            <div>
                <Container>
                <CreateGameModal
                        show={this.state.showCreateGame}
                        onHide={closeCreateGame}
                        heading={"Create Game"}
                />
                <Button variant="light" className="mb-auto" style={{float: 'right'}} onClick={this.handleClickCreate}><i className="fas fa-plus"></i></Button>
                <Tabs id="game-tabs" activeKey={this.state.key} style={{clear: 'both'}} onSelect={key => this.setState({ key })}>
                    <Tab eventKey="allGames" title="All Games">
                    <All peeps={this.props.lobby} />
                    </Tab>

                    <Tab eventKey="sfwGames" title="SFW Games">
                    <SFW peeps={this.props.lobby}  />
                    </Tab>

                    <Tab eventKey="nsfwGames" title="NSFW Games">
                    <NSFW peeps={this.props.lobby}  />
                    </Tab>
                    
                </Tabs>
                </Container>
            </div>
        )
    }
};

function mapStateToProps(state) {
    return {
        game: state.game.game,
        currentUser: state.currentUser.user,
        lobby: state.lobby.games.all,
        loading: state.lobby.games.loading
    };
}

export default compose(
    connect(mapStateToProps, actions),
)(requireAuth(GamesLobby));