import React, { Component } from 'react';
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';

class NSFW extends Component {
    renderNSFWGames(){
        let props = this.props;
        const nsfwGames = props.peeps.filter(g => g.category === 'Not Safe For Work')
        const nsfw = nsfwGames.map(item => {
                return (
                    <Row className="game-row" key={item._id}>
                    
                        <Col md={3} style={{ display: 'flex', justifyContent: 'center' }}>
                            <div>
                                <h5>Creator: {item.username}</h5>
                                {/* <Image src={item.image} roundedCircle /> */}
                            </div>
        
                        </Col>
        
                        <Col md={6} style={{ display: 'flex', justifyContent: 'center' }}>
                            <div>
                                <Link to={`/room/${item._id}`}>
                                    <h3>{item.game_name}</h3>
                                    <p>{item.users.length} players in game</p>
                                </Link>
                            </div>
                        </Col>
        
                        <Col md={3} style={{ display: 'flex', justifyContent: 'center' }}>
                            <div>
                                <p>{item.category}</p>
                                <p>{item.status}</p>
                            </div>
                        </Col>
        
                    </Row>
                );
        });
        
        return nsfw.length > 0 ? nsfw : <h1 className='emptyGames'>No Games in this Category</h1>
    };
        
    render(){
        return(
            <div>
                {this.renderNSFWGames()}
            </div>
        )
    }
    
}

export default NSFW;