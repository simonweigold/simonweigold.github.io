import React from 'react';
import { Handle, Position } from 'reactflow';

const CustomNode = ({ data }) => {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #ddd',
      borderRadius: '5px',
      padding: '10px',
      width: '200px',
    }}>
      <Handle type="target" position={Position.Top} />
      <div>
        <strong>{data.name}</strong>
      </div>
      <div>Rating: {data.rating}</div>
      <p>{data.evaluation}</p>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomNode;
