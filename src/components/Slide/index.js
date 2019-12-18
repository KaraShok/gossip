import styles from "./index.css";
import Panel from "../Panel/index";
export default function({
  height = screen.height,
  width = screen.width,
  scale = 1,
  translateX = 0,
  translateY = 0,
  content,
  selected,
  hasBackground = true,
  editable = false
}) {
  const style = {
    height,
    width,
    transform: `translate(${translateX}px,${translateY}px) scale(${scale})`,
    // transformOrigin: "left top",
    border: selected && "10px solid black"
  };
  const { id } = content;
  return (
    <div
      className={`${styles.container} ${hasBackground && styles.background}`}
      style={style}
    >
      <Panel
        {...content}
        height={height}
        width={width}
        rootId={id}
        editable={editable}
      />
    </div>
  );
}