import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import AddPicture from "./AddPicture";
import Card from "./Card";
import Loader from "../utils/Loader";
import {NotificationError, NotificationSuccess} from "../utils/Notifications";
import {buyCardAction, createCardAction, transferownershipAction, toggleSaleAction,  deleteAction, getCardAction,} from "../../utils/marketplace";
import PropTypes from "prop-types";
import {Row} from "react-bootstrap";

const Cards = ({address, fetchBalance}) => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);

    const getCards = async () => {
        setLoading(true);
        getCardsAction()
            .then(cards => {
                if (cards) {
                    setCards(cards);
                }
            })
            .catch(error => {
                console.log(error);
            })
            .finally(_ => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getCards();
    }, []);

    const createCard = async (data) => {
        setLoading(true);
        createCardAction(address, data)
            .then(() => {
                toast(<NotificationSuccess text="Pokemon card added successfully."/>);
                getCards();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error);
                toast(<NotificationError text="Failed to add a pokemon card."/>);
                setLoading(false);
            })
    };



    const toggleSale = async (card) => {
        setLoading(true);
        pausesaleAction(address, card)
            .then(() => {
                toast(<NotificationSuccess text="Sale toggled successfully"/>);
                getCards();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Failed to toggle sale."/>);
                setLoading(false);
            })
    };


    const transferOwnership = async (card) => {
        setLoading(true);
        transferownershipAction(address, card)
            .then(() => {
                toast(<NotificationSuccess text="Ownership transfered successfully"/>);
                getCards();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Ownership not transfered successfully"/>);
                setLoading(false);
            })
    };




    const buyCard = async (card) => {
        setLoading(true);
        buyCardAction(address, card)
            .then(() => {
                toast(<NotificationSuccess text="Card bought successfully"/>);
                getCards();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Failed to buy card."/>);
                setLoading(false);
            })
    };

    const deleteCard = async (card) => {
        setLoading(true);
        deleteAction(address, card.appId)
            .then(() => {
                toast(<NotificationSuccess text="deleted successfully"/>);
                getCards();
                fetchBalance(address);
            })
            .catch(error => {
                console.log(error)
                toast(<NotificationError text="Failed to delete."/>);
                setLoading(false);
            })
    };

    if (loading) {
        return <Loader/>;
    }
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fs-4 fw-bold mb-0">Pokemon Card Marketplace</h1>
                <AddCard createCard={createCard}/>
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3 mb-5 g-xl-4 g-xxl-5">
                <>
                    {cards.map((data, index) => (
                        <Card
                            address={address}
                            card={data}
                            buyCard={buyCard}
                            toggleSale = {toggleSale}
                            transferOwnership = {transferOwnership}
                            deleteCard={deleteCard}
                            key={index}
                        />
                    ))}
                </>
            </Row>
        </>
    );
};

Cards.propTypes = {
    address: PropTypes.string.isRequired,
    fetchBalance: PropTypes.func.isRequired
};

export default Cards;
