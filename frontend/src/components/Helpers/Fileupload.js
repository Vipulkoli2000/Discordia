import React, { useState } from "react";

const Fileupload = () => {
  const [file, setFile] = useState("");
  const handlefileupload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("File uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  return (
    <div>
      <input onChange={(e) => setFile(e.target.files[0])} type="file" />
      <button onClick={(e) => handlefileupload(e)}>upload</button>
    </div>
  );
};

export default Fileupload;
