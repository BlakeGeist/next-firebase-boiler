import React from "react";
import { connect } from "react-redux";
import Layout from "../../layouts/Layout";
import Carousel from '../../components/Carousel'
import Modal from '../../components/Modal';

const Index = ({ dispatch, lang, modalIsOpen }) => {

    const ModalContainer = () => {	
        if(modalIsOpen){	
            return <Modal />	
        }	
        return null
    }    

    const handleOpenModal = () => {
        dispatch({ type: "SET_ITEM", name: "modalIsOpen", payload: true });
    }

    return (
        <Layout pageMod='index'>
            <Carousel />
            <div className="container">
                <h1>{lang} Home Page</h1>
                <p>
                    <button onClick={handleOpenModal}>
                        Open Modal
                    </button>
                </p>
            </div>
            <ModalContainer />
        </Layout>
    );
};

export default connect(state => state)(Index);
