import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { connect } from "react-redux";
import Head from 'next/head';

const TextEditor = ({ handleEditorChange, handleOnSubmit }) => {
    return (
        <>
            <Head>
                <script src="https://cdn.tiny.cloud/1/hrdu9ovp596k3gsafc7irg2b83dl98x3e1020egi97hkxeiu/tinymce/5/tinymce.min.js" referrerPolicy="origin"></script>
            </Head>
            <form onSubmit={handleOnSubmit}>
                <Editor
                    initialValue="<p>This is the initial content of the editor</p>"
                    init={{
                        height: 300,
                        menubar: false,
                        plugins: [
                            "advlist autolink lists link image charmap print preview anchor",
                            "searchreplace visualblocks code fullscreen",
                            "insertdatetime media table paste code help wordcount",
                            "save"
                        ],
                        toolbar:
                            "undo redo | link | image | code | formatselect | bold italic backcolor | \
                            alignleft aligncenter alignright alignjustify | \
                            bullist numlist outdent indent | removeformat | help"
                    }}
                    onChange={handleEditorChange}                
                />
                <button type="submit">Submit</button>
            </form>                
        </>
    );
};

export default connect(state => state)(TextEditor);
