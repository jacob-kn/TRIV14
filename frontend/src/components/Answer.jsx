import { useState } from "react";
import PropTypes from "prop-types";

export default function Answer({ id, selected, onClick, children, className }) {
  const color = ["bg-blue-600", "bg-red-600", "bg-green-600", "bg-purple-600"];
  
  // const [selected, setSelected] = useState(false);
  // let variant = "primary";

  // const handleButtonClick = () => {
  //   setSelected(true);
  //   // variant = selected ? "secondary" : "primary";
  //   onClick(id); // Pass the current id to the provided onClick handler
  // };

  // const variants = {
  //   primary: {
  //     border: "none"
  //   },
  //   secondary: {
  //     border: "5px solid lightgreen",
  //     boxSizing: "border-box",
  //   },
  // };

  // const style = variants[variant] || {};

  return (
    <button
      onClick={() => {
        // handleButtonClick();
        onClick(id)
      }}
      className={className + ` ${color[id]}`}
      style={{
        color: "white",
        borderRadius: "5px",
        cursor: "pointer",
        boxSizing: "border-box",
        border: selected ? "5px solid lightgreen" : "none",
      }}
    >
      {children}
    </button>
  );
}

Answer.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Answer.defaultProps = {
  onClick: () => {},
  className: '',
};