import "./Button.css"; // Импортируем стили для кнопки
const Button = (props) => {
  return (
    <button
      className={`${props.className} button`}
      onClick={props.onClick}
      type={props.type || "button"}
      style={{ background: props.background }}
    >
      {props.text}
    </button>
  );
};

export default Button;
