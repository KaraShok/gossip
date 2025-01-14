import { connect } from "dva";
import classNames from "./index.css";
import { Icon } from "antd";
import Box from "../Box";
import Node from "../Node";
import Input from "../Input";
import { useState, useEffect } from "react";

export default connect(
  state => ({
    variables: state.slides.attributeVars,
    selectedArributeId: state.slides.selectedArributeId
  }),
  {
    deleteVar: id => ({ type: "slides/deleteVar", payload: { id } }),
    addVar: type => ({ type: "slides/addVar", payload: { type } }),
    selectVar: id => ({ type: "slides/selectVar", payload: { id } }),
    changeVar: (value, type) => ({
      type: "slides/changeVar",
      payload: { value, type }
    })
  }
)(function({
  height,
  variables,
  selectedArributeId,
  deleteVar,
  addVar,
  selectVar,
  changeVar
}) {
  const [edit, setEdit] = useState(-1);
  const icon = {
    color: "bg-colors",
    number: "number"
  };

  const items = [
    { name: "颜色", value: "color", type: "bg-colors" },
    { name: "数值", value: "number", type: "number" }
  ];

  const content = (
    <ul className={classNames.list}>
      {items.map((item, index) => (
        <li
          key={index}
          onClick={() => addVar(item.value)}
          style={{ cursor: "pointer" }}
          className={classNames.item}
        >
          <Icon className={classNames.icon} type={item.type} />
          <span>{item.name}</span>
        </li>
      ))}
    </ul>
  );

  function handleDragStart(e, item) {
    selectVar(item.id);
    e.dataTransfer.setData("attr", `${item.type}-${item.id}`);
  }

  function scrollTo(id) {
    const a = document.createElement("a");
    a.href = `#${id}`;
    a.onclick = () => false;
    a.click();
  }

  useEffect(() => {
    scrollTo(selectedArributeId);
  }, [selectedArributeId]);

  return (
    <Box
      height={height}
      title="变量"
      iconType="shop"
      popover={content}
      nodata={variables.length === 0}
      nodataInfo="没有属性变量～"
      name="vari"
      url="https://github.com/pearmini/gossip/blob/master/tutorials.md#4%E8%8E%B7%E5%BE%97%E7%94%BB%E5%B8%83%E7%9B%91%E5%90%AC%E4%BA%8B%E4%BB%B6%E7%A7%BB%E5%8A%A8%E6%95%B0%E7%BB%84"
    >
      {variables.map(item => (
        <div
          key={item.id}
          className={classNames.node}
          onDragStart={e => handleDragStart(e, item)}
          draggable
          onClick={() => selectedArributeId !== item.id && selectVar(item.id)}
        >
          <Node
            id={item.id}
            height="2em"
            onDelete={() => deleteVar(item.id)}
            edit={item.id === edit}
            highlight={selectedArributeId === item.id}
            hasDelete={item.canDelete}
            onMouseLeave={() => edit !== -1 && setEdit(-1)}
            onEdit={() => {
              if (item.id === edit) {
                setEdit(-1);
              } else {
                setEdit(item.id);
                selectVar(item.id);
              }
            }}
          >
            <div className={classNames.wrapper}>
              <Icon type={icon[item.type]}></Icon>
              <div className={classNames.name}>
                {edit === item.id ? (
                  <input
                    value={item.name}
                    onChange={e => changeVar(e.target.value, "name")}
                  />
                ) : (
                  <div>{item.name}</div>
                )}
              </div>
              <Input
                type={item.type}
                value={item.value}
                onChange={value => changeVar(value, "value")}
                range={[0, 500]}
              />
            </div>
          </Node>
        </div>
      ))}
    </Box>
  );
});
