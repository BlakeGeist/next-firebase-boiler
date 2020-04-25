import React, { useState } from 'react';
import { connect } from 'react-redux'
import { Editor } from '@tinymce/tinymce-react';

const Modal = ({ dispatch, state, setState, modalCard }) => {

  [state, setState] = useState({
    name: `${modalCard.name} | ${modalCard.set_name} Magic The Gathering Card`,
    price: modalCard.prices.usd / 100,
    qty: modalCard.qty,
    description: 'This is the description'
  })

  const handleCloseModal = (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_ITEM', name: 'modalIsOpen', payload: false });
  }

  const handleChange = (e) => {
    e.preventDefault();
    let tempObj = {
      ...state
    }
    tempObj[event.target.name] = e.target.value;
    setState(tempObj)
  }

  const handleEditorChange = (e) => {
    let tempObj = {
      ...state
    }
    tempObj.description = e.target.getContent();
    setState(tempObj)
  }

  return (
    <div className="modal-bg">
      <div className="modal">
        <div className="modal-header">
          <span>This is the modal header</span>
          <span><a onClick={handleCloseModal} href="">Close</a></span>
        </div>
        <div className="modal-body">

          <form>
            <div><input onChange={handleChange} type="text" name="name" value={state.name} /></div>
            <div><input onChange={handleChange} type="text" name="price" value={state.price} /></div>
            <div><input onChange={handleChange} type="text" name="qty" value={state.qty} /></div>

            <div className="text-editor">

              <Editor
                initialValue="<p>This is the initial content of the editor</p>"
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                  ],
                  toolbar:
                    'undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help'
                }}
                onChange={handleEditorChange}

              />

            </div>

          </form>

          <img src={modalCard.image_uris.normal} width="260px" height="362px;" />

        </div>
      </div>
      <style jsx>{`
        .modal-bg {
          position: fixed;
          width: 100%;
          height: 100%;
          background-color: #f1f1f1;
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
        }
          .modal-header{
            display: flex;
            justify-content: space-between;
          }
          input, textarea {
            width: 100%
          }
          .text-editor{
            min-height: 300px;
            min-width: 751px;
          }
      `}</style>
    </div>
  )
}

export default connect(state => state)(Modal);
