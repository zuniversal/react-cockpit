import React, { useState, useEffect } from 'react';
import upIcon from '@/assets/icons/up-arrow.svg';
import downIcon from '@/assets/icons/down-arrow.svg';

export const MoreBtn = (props) => {
  const [isFold, setIsFold] = useState(false);
  return (
    <div
      onClick={() => {
        props.click(!isFold);
        setIsFold(!isFold);
      }}
      style={{
        color: '#969696',
        textAlign: 'center',
        border: '1px solid #ECECEC',
        borderWidth: '1px 0',
        padding: '8px 0',
        margin: '20px 0',
      }}
    >
      <span style={{ fontSize: 12 }}>查看近12月趋势对比</span>
      {isFold ? (
        <img
          style={{
            marginLeft: '9px',
          }}
          src={upIcon}
        />
      ) : (
        <img
          style={{
            marginLeft: '9px',
          }}
          src={downIcon}
        />
      )}
    </div>
  );
};
