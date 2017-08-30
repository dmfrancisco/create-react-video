import React, { Component } from "react";
import ReactDOM from "react-dom";
import Gideo, { Audio, Video, animatable } from "@robo54/gideo";

const Text = props => {
  const style = {
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "center"
  };
  return (
    <div style={style}>
      {props.children}
    </div>
  );
};

class Project extends Component {
  render() {
    return (
      <Gideo width={600} height={600} duration={10}>
        <Text>Hello, World!</Text>
      </Gideo>
    );
  }
}

ReactDOM.render(<Project />, document.getElementById("root"));
