import { useEffect } from 'react';

export function HeadTitle(props: { children: string }) {
  return null;
  useEffect(() => {
    const title = document.title;
    document.title = props.children;
    return () => {
      document.title = title;
    };
  }, [props.children]);

  return null;
}
