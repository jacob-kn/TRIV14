import React, { useState } from "react";

export default function FillInTheBlank({ paragraphText, onTextChange }) {
  const [textInput, setTextInput] = useState("");

  const handleInputChange = (e) => {
    setTextInput(e.target.value);
    onTextChange(e.target.value);
  };

  return (
    <div>
      <p className="text-white">
        {paragraphText.slice(0, paragraphText.indexOf("_"))}
        <input
          type="text"
          value={textInput}
          onChange={handleInputChange}
          placeholder="Answer"
          className="mx-1 text-black rounded placeholder:ml-2 focus:border-sky-500 placeholder:text-gray-500 pl-[8px] placeholder:italic"
        />
        {paragraphText.slice(paragraphText.indexOf("_") + 1)}
      </p>
    </div>
  );
}
