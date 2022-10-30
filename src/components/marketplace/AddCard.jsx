import React, {useCallback, useState} from "react";
import PropTypes from "prop-types";
import {Button, FloatingLabel, Form, Modal} from "react-bootstrap";
import {stringToMicroAlgos} from "../../utils/conversions";

const AddCard = ({createCard}) => {
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [attributes, setAttributes] = useState("");
    const [price, setPrice] = useState(0);

    const isFormFilled = useCallback(() => {
        return name && image && attributes && price > 0
    }, [name, image, attributes, price]);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button
                onClick={handleShow}
                variant="dark"
                className="rounded-pill px-0"
                style={{width: "38px"}}
            >
                <i className="bi bi-plus"></i>
            </Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>New Pokemon card</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <FloatingLabel
                            controlId="inputName"
                            label="Card name"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                                placeholder="Enter name of pokemon card"
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="inputUrl"
                            label="Image URL"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Image URL"
                                value={image}
                                onChange={(e) => {
                                    setImage(e.target.value);
                                }}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="inputAttributes"
                            label="Attributes"
                            className="mb-3"
                        >
                            <Form.Control
                                as="textarea"
                                placeholder="attributes"
                                style={{ height: "80px" }}
                                onChange={(e) => {
                                    setAttributes(e.target.value);
                                }}
                            />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="inputPrice"
                            label="Price in ALGO"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="Price"
                                onChange={(e) => {
                                    setPrice(stringToMicroAlgos(e.target.value));
                                }}
                            />
                        </FloatingLabel>
                    </Modal.Body>
                </Form>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        variant="dark"
                        disabled={!isFormFilled()}
                        onClick={() => {
                            createCard({
                                name,
                                image,
                                attributes,
                                price
                            });
                            handleClose();
                        }}
                    >
                        Save pokemon card
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

AddCard.propTypes = {
    createCard: PropTypes.func.isRequired,
};

export default AddCard;
