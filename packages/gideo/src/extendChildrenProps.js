import React, { Children } from 'react';

// This is just a higher-level API for dealing with times
function extendChildProps(previous, childProps) {
  const props = { ...childProps };

  if (props.startWith) {
    props.begin = previous[previous.length + props.startWith].props.begin;
    props.startWith = null;
  }
  if (props.endWith) {
    props.end = previous[previous.length + props.endWith].props.end;
    props.endWith = null;
  }
  if (props.startAfter) {
    props.begin = previous[previous.length + props.startAfter].props.end;
    props.startAfter = null;
  }
  if (props.duration) {
    props.end = props.begin + props.duration;
    props.duration = null;
  }
  return props;
}

export default function extendChildrenProps(children) {
  const previous = [];

  Children.forEach(children, (child) => {
    const props = extendChildProps(previous, child.props);
    previous.push(React.cloneElement(child, props));
  });
  return previous;
}
