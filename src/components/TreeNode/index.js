import { useState } from "react";
import classNames from "./index.css";
import { Icon, Popover } from "antd";
import { range } from "d3-array";
export default function({
  node,
  children,
  onNodeDrag,
  onNodeDrop,
  highlightColor,
  width,
  onClickRight,
  onClickBottom,
  popoverRight,
  popoverBottom,
  hasBottom = true,
  hasTop = true,
  hasRight = true,
  hasMiddle = true,
  hasLeft = true,
  style,
  canDrag = true
}) {
  const [hover, setHover] = useState(false);
  const [middle, setMiddle] = useState(false);
  const [bottom, setBottom] = useState(false);
  const [top, setTop] = useState(false);
  const [left, setLeft] = useState(range(node.depth).map(() => false));
  if (node.depth !== left.length) {
    setLeft(range(node.depth).map(() => false));
  }

  const styles = {
    container: {
      background: middle && highlightColor,
      width
    },
    top: { background: top && highlightColor, width },
    middle: { width },
    bottom: { background: bottom && highlightColor, width },
    bottomButton: {
      width
    }
  };

  function handleDrop(e, type, index) {
    // 清除状态
    setMiddle(false);
    setTop(false);
    setBottom(false);
    setLeft([...left.map(() => false)]);

    // 判断拖拽的类型
    const dragData = e.dataTransfer.getData("drag");
    const [t, data] = dragData.split("-");
    // 获得拖拽的节点
    let dragId;
    if (t === "node") {
      dragId = isNaN(parseInt(data)) ? data : parseInt(data);
    } else {
      dragId = parseInt(data);
    }
    onNodeDrop(dragId, node.id, type, t, index);
  }

  function handleDragStart(e) {
    onNodeDrag && onNodeDrag();
    e.dataTransfer.setData("drag", `node-${node.id}`);
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseOver={() => !hover && setHover(true)}
    >
      <div className={classNames.container}>
        {left.map((_, index) =>
          index === 0 || !hasLeft ? (
            <div className={classNames.leftItem} key={index}></div>
          ) : (
            <div
              key={index}
              className={classNames.leftItem}
              style={{
                background: left[index] && highlightColor
              }}
              onDragEnter={() => {
                left[index] = true;
                setLeft([...left]);
              }}
              onDragLeave={() => {
                left[index] = false;
                setLeft([...left]);
              }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, "left", index)}
            ></div>
          )
        )}
        <div style={styles.container}>
          {hasTop ? (
            <div
              style={styles.top}
              className={classNames.line}
              onDragEnter={() => setTop(true)}
              onDragLeave={() => setTop(false)}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, "top")}
            ></div>
          ) : (
            <div className={classNames.line}></div>
          )}
          {hasMiddle ? (
            <div
              style={styles.middle}
              onDrop={e => handleDrop(e, "middle")}
              onDragOver={e => {
                if (!middle) setMiddle(true);
                e.preventDefault();
              }}
              onDragLeave={() => setMiddle(false)}
              onDragStart={handleDragStart}
              draggable={canDrag}
            >
              {children}
            </div>
          ) : (
            <div
              style={styles.middle}
              onDragStart={handleDragStart}
              draggable={canDrag}
            >
              {children}
            </div>
          )}

          {hasBottom ? (
            <div
              style={styles.bottom}
              onDragEnter={() => setBottom(true)}
              onDragLeave={() => setBottom(false)}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, "bottom")}
              className={classNames.line}
            ></div>
          ) : (
            <div className={classNames.line}></div>
          )}
        </div>
        {hasRight &&
          hover &&
          (popoverRight ? (
            <Popover
              content={popoverRight}
              title="选择一种类型"
              placement="left"
              trigger="click"
              arrowPointAtCenter
            >
              <Icon
                type="plus-circle"
                className={classNames.right}
                onClick={onClickRight}
              />
            </Popover>
          ) : (
            <Icon
              type="plus-circle"
              className={classNames.right}
              onClick={() => {
                onClickRight();
                setHover(false);
              }}
            />
          ))}
      </div>
      <div
        style={{ ...styles.bottomButton, ...style }}
        className={classNames.bottomButton}
      >
        {hover &&
          hasBottom &&
          (popoverBottom ? (
            <Popover
              content={popoverBottom}
              title="选择一种类型"
              placement="left"
              trigger="click"
              arrowPointAtCenter
            >
              <Icon
                type="plus-circle"
                className={classNames.right}
                onClick={onClickBottom}
              />
            </Popover>
          ) : (
            <Icon
              type="plus-circle"
              className={classNames.right}
              onClick={() => {
                onClickBottom();
                setHover(false);
              }}
            />
          ))}
      </div>
    </div>
  );
}
