import PropTypes from "prop-types";

const CustomTag = ({
  fontSize = "text-xs",
  color = "text-black",
  backgroundColor = "bg-slate-50",
  content = "",
}) => {
  return (
    <span
      className={`whitespace-nowrap rounded-lg ${backgroundColor} p-1 overflow-x-auto w-fit inline-block my-1`}
    >
      <p className={`whitespace-nowrap ${fontSize} ${color} font-medium`}>
        {content}
      </p>
    </span>
  );
};

CustomTag.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  content: PropTypes.string,
};

export default CustomTag;
