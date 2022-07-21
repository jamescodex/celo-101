import React from "react";
import "./Create.css";

const Create = ({ createGood }) => {
  const [name, setName] = React.useState();
  const [description, setDescription] = React.useState();
  const [image, setImage] = React.useState();
  const [price, setPrice] = React.useState();

  return (
    <div className="create">
      <div className="form-title">Create new good</div>
      <div className="form">
        <input
          type="text"
          placeholder="Enter goods name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter goods description"
          onChange={(e) => setImage(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter goods image URL"
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter goods price"
          onChange={(e) => setPrice(e.target.value)}
        />
        <div
          className="create-button"
          onClick={() => createGood(name, image, description, price)}
        >
          Create
        </div>
      </div>
    </div>
  );
};

export default Create;
