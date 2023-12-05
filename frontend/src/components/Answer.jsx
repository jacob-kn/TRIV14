import { useState } from "react";
import PropTypes from "prop-types";

export default function Answer({ id, selected, onClick, clickable, children, className }) {
  const color = ["bg-blue-600", "bg-red-600", "bg-green-600", "bg-purple-600"];

  return (
    <button
      onClick={() => {
        onClick(id)
      }}
      disabled={clickable}
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