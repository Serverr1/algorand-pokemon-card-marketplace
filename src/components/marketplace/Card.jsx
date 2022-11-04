import React, {useState} from "react";
import PropTypes from "prop-types";
import {Badge, Button, Card, Col, FloatingLabel, Form, Stack} from "react-bootstrap";
import {microAlgosToString, truncateAddress} from "../../utils/conversions";
import Identicon from "../utils/Identicon";
import {stringToMicroAlgos} from "../../utils/conversions";

const CARD = ({address, card, buyCard, deleteCard, changePrice, toggleSale}) => {
    const {name, image, owner, attributes, price, isforsale, sold, appId} = card;


    const [newprice, setNewPrice] = useState(0);
   

    return (
        <Col key={appId}>
            <Card className="h-100">
                <Card.Header>
                    <Stack direction="horizontal" gap={2}>
                        <span className="font-monospace text-secondary">{truncateAddress(owner)}</span>
                        <Identicon size={28} address={owner}/>
                    </Stack>

                    <Badge bg="secondary" className="ms-auto">
                            {sold} Sold
                        </Badge>
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
                            variant="outline-info"
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
                            controlId="inputPrice"
                            label="Price in ALGO"
                            className="mb-3"
                        >
                            <Form.Control
                                type="number"
                                placeholder="Enter new price"
                                onChange={(e) => {
                                    setNewPrice(stringToMicroAlgos(e.target.value));
                                }}
                            />
                        </FloatingLabel>
                             <Button
                                variant="info"
                                onClick={() => changePrice(card, newprice)}
                                className="btn"
                            >
                             Change Price
                            </Button>
                        

                            </Form>
}
                   
                           


                  
                </Card.Body>
            </Card>
        </Col>
    );
};

CARD.propTypes = {
    address: PropTypes.string.isRequired,
    card: PropTypes.instanceOf(Object).isRequired,
    buyCard: PropTypes.func.isRequired,
    changePrice: PropTypes.func.isRequired,
    toggleSale: PropTypes.func.isRequired,
    deleteCard: PropTypes.func.isRequired
};

export default CARD;
