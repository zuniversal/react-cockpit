/*
 * @Descripttion:
 * @version: 1.0
 * @Author: Teemor
 * @Date: 2022-12-15 08:57:39
 * @LastEditors: Teemor
 */
// import { useNavigate } from 'react-router-dom'

import { useSearchParams } from 'react-router-dom';

import { Example } from '@/components/example';
import { HeadTitle } from '@/components/helmet';
import styles from './index.module.less';
export default function NewsDetail() {
  //   const navigator = useNavigate()
  const [search] = useSearchParams();
  console.log(search.get('detailId'), 123);
  const title = search.get('title');
  return (
    <div>
      <HeadTitle>{title}</HeadTitle>
      <div className={styles.newsDetail}>
        <div className={styles.newsDetailTitle}>{title}</div>
        <div className={styles.newsDetailMain}>
          文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内容文字内
        </div>
      </div>
      <Example />
    </div>
  );
}
