import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const API_URL = "http://127.0.0.1:8080/api/blog/image/upload";

export default function MyEditor({ ...props }) {
  const [editorData, setEditorData] = useState("");

  const handleEditorChange = (data) => {
    const imgRegex = /<img.*?src="(.*?)"/g;
    const prevImages = [...editorData.matchAll(imgRegex)].map((match) => match[1]);
    const currImages = [...data.matchAll(imgRegex)].map((match) => match[1]);

    const deletedImages = prevImages.filter((img) => !currImages.includes(img));

    deletedImages.forEach((imgUrl) => {
      const imageName = imgUrl.split("/").pop();
      fetch(`http://localhost:8080/api/blog/image/${imageName}`, {
        method: "DELETE",
      })
        .then((res) => console.log(res))
        .catch((err) => console.error(err));
    });

    setEditorData(data);
  };

  function uploadAdapter(loader) {
    return {
        upload: () => {
            return new Promise((resolve, reject) => {
                const body = new FormData();
                loader.file.then((file) => {
                    body.append("image", file);
                    fetch(`${API_URL}`, {
                        method: "post",
                        body: body
                    })
                    .then((res) => res.text())
                    .then((res) => {
                        console.log(res);
                        resolve({
                            default: `http://localhost:8080/api/blog/image/display/${res}`
                        });
                    })
                    .catch((err) => {
                        reject(err);
                    });
                });
            });
        }
    };
  }

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return uploadAdapter(loader);
    };
  }

  return (
    <div className="App">
        <CKEditor
            config={{
                extraPlugins: [uploadPlugin],
            }}
            editor={ClassicEditor}
            onReady={(editor) => {}}
            onBlur={(event, editor) => {}}
            onFocus={(event, editor) => {}}
            onChange={(event, editor) => {
                handleEditorChange(editor.getData());
            }}
            {...props}
        />
    </div>
  );
}
