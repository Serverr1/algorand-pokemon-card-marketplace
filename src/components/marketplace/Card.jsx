import React, {useState} from "react";
import PropTypes from "prop-types";
import {Badge, Button, Card, Col, FloatingLabel, Form, Stack} from "react-bootstrap";
import {microAlgosToString, truncateAddress} from "../../utils/conversions";
import Identicon from "../utils/Identicon";
import {stringToMicroAlgos} from "../../utils/conversions";

const Card = ({address, card, buyCard, deleteCard, transferOwnership, toggleSale}) => {
    const {name, image, attributes, price, isforsale, appId, owner} = card;


    const [newaddress, setNewAddress] = useState("");
   

    return (
        <Col key={appId}>
            <Card className="h-100">
                <Card.Header>
                    <Stack direction="horizontal" gap={2}>
                        <span className="font-monospace text-secondary">{truncateAddress(owner)}</span>
                        <Identicon size={28} address={owner}/>
                    </Stack>
                </Card.Header>
                <div className="ratio ratio-4x3">
                    <img src={image} alt={name} style={{objectFit: "cover"}}/>
                </div>
                <Card.Body className="d-flex flex-column text-center">
                    <Card.Title>{name}</Card.Title>
                    <Card.Text className="flex-grow-1">{attributes}</Card.Text>
                    <Form className="d-flex align-content-stretch flex-row gap-2">
                       
                        {card.owner !== address && isforsale === 1 &&
                        <Button
                            variant="outline-dark"
                            onClick={() => buyCard(card)}
                            className="w-75 py-3"
                        >
                            Buy for {microAlgosToString(price)} ALGO
                        </Button>
                        }
                        {card.owner === address &&
                            <Button
                                variant="outline-danger"
                                onClick={() => deleteCard(card)}
                                className="btn"
                            >
                                <i className="bi bi-trash"></i>
                            </Button>
                        }

                        </Form>


             {card.owner === address &&
                            <Button
                                variant="outline-danger mt-2"
                                onClick={() => toggleSale(card)}
                                className="btn"
                            >
                              {isforsale === 0 ? ("Set Forsale"): ("Set not for sale")}
                            </Button>
                        }


           

                   {card.owner === address && 


                        <Form>
                            <FloatingLabel
                            controlId="inputAddress"
                            label="Receiver Address"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                onChange={(e) => {
                                    setNewAddress(e.target.value);
                                }}
                                placeholder="Enter Receiver Address"
                            />
                        </FloatingLabel>
                             <Button
                                variant="outline-danger"
                                onClick={() => transferOwnership(card, newaddress)}
                                className="btn"
                            >
                              Transfer Card
                            </Button>
                        

                            </Form>
}
                   
                           


                  
                </Card.Body>
            </Card>
        </Col>
    );
};

Card.propTypes = {
    address: PropTypes.string.isRequired,
    card: PropTypes.instanceOf(Object).isRequired,
    buyCard: PropTypes.func.isRequired,
    transferOwnership: PropTypes.func.isRequired,
    toggleSale: PropTypes.func.isRequired,
    deleteCard: PropTypes.func.isRequired
};

export default Card;
