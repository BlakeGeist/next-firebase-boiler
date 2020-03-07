import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { connect } from "react-redux";

const TextEditor = ({ dispatch }) => {

  const handleEditorChange = (e) => {
    const content = e.target.getContent();
  };

  return (
    <Editor
      initialValue="<p>This is the initial content of the editor</p>"
      init={{
        height: 300,
        menubar: false,
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste code help wordcount"
        ],
        toolbar:
          "undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | help"
      }}
      onChange={handleEditorChange}
    />
  );
};


export default connect(state => state)(TextEditor);
