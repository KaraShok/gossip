import { connect } from "dva";
import { Select, Button, Icon, Input, Popover } from "antd";
const { Option } = Select;

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
  const variable = variables.find(item => item.id === selectedArributeId);
  const icon = {
    color: <Icon type="bg-colors" />,
    number: <Icon type="calculator" />
  };

  function handleDeleteVar(id) {
    deleteVar(id);
  }

  function handleAddVar(type) {
    addVar(type);
  }

  function handleSelect(id) {
    selectVar(id);
  }

  function handleChangeVar(value, type) {
    changeVar(value, type);
  }

  function handleDragStart(e, item) {
    console.log(item, "drag");
    e.dataTransfer.setData("type", item.type);
    e.dataTransfer.setData("id", item.id);
  }

  return (
    <div style={{ height, overflow:"auto" }}>
      <div style={{ display: "flex" }}>
        <h1>Variables</h1>
        <div style={{ marginLeft: 75 }}>
          <Popover
            content={[
              { name: "颜色", value: "color" },
              { name: "数值", value: "number" }
            ].map((item, index) => (
              <div
                key={index}
                onClick={() => handleAddVar(item.value)}
                style={{ cursor: "pointer" }}
              >
                {item.name}
              </div>
            ))}
            title="选择一种类型"
            placement="bottomRight"
          >
            <Button icon="plus" type="primary" />
          </Popover>
        </div>
      </div>
      {variable ? (
        <div>
          <div>
            名字：
            <Input
              value={variable.name}
              style={{ width: 100 }}
              onChange={e => handleChangeVar(e.target.value, "name")}
            />
          </div>
          <div>
            值：
            <Input
              value={variable.value}
              style={{ width: 100 }}
              type={variable.type}
              onChange={e => handleChangeVar(e.target.value, "value")}
            />
          </div>
          <div>类型：{variable.type}</div>
        </div>
      ) : (
        <div>未选择</div>
      )}
      <br></br>
      <div style={{ overflow: "auto" }}>
        {variables.map(item => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-around",
              lineHeight: 2
            }}
          >
            <Button
              type="primary"
              icon="drag"
              draggable
              onDragStart={e => handleDragStart(e, item)}
            />

            <div
              style={{
                display: "flex",
                background: "white",
                width: 120,
                border: selectedArributeId === item.id && "1px solid black"
              }}
              onClick={() => handleSelect(item.id)}
            >
              <div>{icon[item.type]}</div>
              <div style={{ marginLeft: 10 }}>{item.name}</div>
            </div>
            <Button
              type="danger"
              icon="delete"
              onClick={() => handleDeleteVar(item.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
});