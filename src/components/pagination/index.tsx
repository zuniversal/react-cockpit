import { Button } from 'antd-mobile';
import { LeftOutline, RightOutline } from 'antd-mobile-icons';
import { useEffect, useState } from 'react';
import doubleArrowIcon from '@/assets/icons/double-arrow.svg';

export function Pagination(props: {
  total: number;
  current: number;
  buttonWidth?: number;
  onChange?: (next: number) => void;
}) {
  const [list, setList] = useState([0, 1, 2, 3, 4]);
  const { total, current, onChange = () => {}, buttonWidth = 30 } = props;

  useEffect(() => {
    if (total <= 5) {
      setList(Array.from({ length: total }, (v, k) => k + 1));
      return;
    }
    if (current < 3) {
      setList([1, 2, 3, 4, 5]);
      return;
    }
    if (current > total - 3) {
      setList([-4, -3, -2, -1, 0].map((value) => value + total));
      return;
    }
    setList([-2, -1, 0, 1, 2].map((value) => value + current));
  }, [total, current]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Button
        disabled={current === 1}
        onClick={() => {
          onChange(1);
        }}
        style={{
          border: 0,
          fontSize: 10,
          width: buttonWidth,
          paddingLeft: 7,
          paddingRight: 7,
        }}
      >
        <div style={{ display: 'flex', flex: 1 }}>
          <img style={{ transform: 'rotate(180deg)' }} src={doubleArrowIcon} />
        </div>
      </Button>
      <Button
        onClick={() => {
          onChange(current - 1);
        }}
        disabled={current === 1}
        style={{
          fontSize: 10,
          width: buttonWidth,
          paddingLeft: 7,
          paddingRight: 7,
        }}
      >
        <LeftOutline />
      </Button>
      {list.map((value) => {
        return (
          <div key={value} style={{ marginLeft: 2, marginRight: 2 }}>
            <Button
              onClick={() => onChange(value)}
              style={{
                width: buttonWidth,
                borderColor: current === value ? '#6E94F2' : 'transparent',
                color: current === value ? '#6E94F2' : '#000',
                fontSize: 10,
              }}
            >
              {value}
            </Button>
          </div>
        );
      })}
      <Button
        disabled={current === total}
        onClick={() => {
          onChange(current + 1);
        }}
        style={{
          fontSize: 10,
          width: buttonWidth,
          paddingLeft: 7,
          paddingRight: 7,
        }}
      >
        <RightOutline />
      </Button>
      <Button
        disabled={current === total}
        onClick={() => {
          onChange(total);
        }}
        style={{
          border: 0,
          fontSize: 10,
          width: buttonWidth,
          paddingLeft: 7,
          paddingRight: 7,
        }}
      >
        <div style={{ display: 'flex', flex: 1 }}>
          <img src={doubleArrowIcon} />
        </div>
      </Button>
    </div>
  );
}
