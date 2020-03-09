import React, { useEffect } from "react";
import { connect } from "react-redux";

const Modal = ({ modalTarget, dispatch }) => {
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);
    const handleCloseModal = () => {
        dispatch({ type: "SET_ITEM", name: "modalTarget", payload: null });
    };
    const handleKeyPress = (event) => {
        if(event.key === 'Escape'){
            handleCloseModal()
        }
    }
    if(modalTarget){
        return (
            <div className="modal-bg" onKeyPress={e => handleKeyPress(e)}>
                <div className="modal">
                    <div className="modal-header">
                        <span>This is the modal header</span>
                        <span><a onClick={handleCloseModal} href="">Close</a></span>
                    </div>
                    <div className="modal-body">
                        {modalTarget}
                        This is the modal body
                    </div>
                    <div className="modal-footer">
                        This is the modal footer
                    </div>
                </div>
                <style jsx>{`
                    .modal-bg {
                        position: fixed;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(50, 115, 220, 0.3);
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .modal {
                        background-color: #fff;
                        padding: 15px;
                        min-width: 500px;
                        min-height: 300px;
                        display: flex;
                        flex-direction: column;                    
                    }
                        .modal-header{
                            display: flex;
                            justify-content: space-between;
                        }
                        .modal-body {
                            flex: 1 1 auto;
                        }
                    input, textarea {
                        width: 100%
                    }
                `}</style>
            </div>
        );
    }
    return null
};

export default connect(state => state)(Modal);
