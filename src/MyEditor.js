import React, { useState } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';

const MyEditor = () => {
  const [editorData, setEditorData] = useState('');

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
  };

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:8080/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const onReadyHandler = (editor) => {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return {
        upload: async () => {
          const file = await loader.file;
          await handleFileUpload(file);
          return Promise.resolve({ default: 'http://path-to-uploaded-image.com' });
        },
      };
    };
  };

  return (
    <div>
      <h2>CKEditor Example</h2>
      <CKEditor
        editor={ClassicEditor}
        data={editorData}
        onChange={handleEditorChange}
        config={{
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            'blockQuote',
            'undo',
            'redo',
            'imageUpload',
          ],
          ckfinder: {
            uploadUrl: 'http://localhost:8080/api/upload',
          },
        }}
        onReady={onReadyHandler}
      />
      <div>
        <h2>Editor Output</h2>
        <div dangerouslySetInnerHTML={{ __html: editorData }} />
      </div>
    </div>
  );
};

export default MyEditor;
