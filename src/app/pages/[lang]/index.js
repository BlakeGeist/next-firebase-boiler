import React from "react";
import { connect } from "react-redux";
import Layout from "../../layouts/Layout";
import Carousel from '../../components/Carousel';
import Modal from '../../components/Modal';

const Index = ({ dispatch, lang }) => {
    const ModalContent = () => {
        return (
            <h1>This is the body of the modal</h1>
        )
    }
    const handleOpenModal = () => {
        dispatch({ type: "SET_ITEM", name: "modalTarget", payload: <ModalContent /> });
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
            <Modal />
        </Layout>
    );
};

export default connect(state => state)(Index);
