import React from 'react';

export function RestHeader(props) {
  const { method, endpoint } = props;

  let color = '#000000';

  switch (method.toUpperCase()) {
    case 'GET':
      color = '#0d8d67';
      break;
    case 'POST':
      color = '#026aca';
      break;
    case 'PUT':
      color = '#604aa2';
      break;
    case 'DELETE':
      color = '#b91926';
      break;
    default:
      color = '#000000';
  }

  return (
    <div
      style={{
        border: '3px solid rgba(223, 225, 236, 0.7)',
        borderRadius: '10px',
        padding: '12px',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          background: color,
          fontSize: '0.6em',
          borderRadius: '10px',
          color: '#ffffff',
          padding: '0.3em 1em',
          height: '100%',
          verticalAlign: 'middle',
          marginBottom: '0.3em',
        }}
      >
        <span>{method.toUpperCase()}</span>
      </div>
      <span style={{ fontWeight: 'bold', marginLeft: '0.5em' }}>
        {' '}
        <span
          style={{
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            borderLeft: '2px solid rgba(223, 225, 236, 0.7)',
            paddingLeft: '0.5em',
          }}
        >
          {endpoint}
        </span>
      </span>
    </div>
  );
}
