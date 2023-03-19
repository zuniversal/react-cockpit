# 表格

# Table

普通表格

# InfiniteTable

自动加载的表格，默认只需要传入`columns`和`loadMore`参数即可渲染一个表格

- `columns`: 表格的列信息，`name`表示字段名，`label`表示列名
- `loadMore`: 传入页信息，返回该页的数据的方法

Example([src/apps/metricsofsales/DetailTable.tsx](../../apps/metricsofsales/DetailTable.tsx)):

```tsx
export function WrappedInfiniteTable() {
  const request = useRequest<{
    total: number;
    current: number;
    records: {
      batteryName: string;
      deliveryType: string;
      salesQuantity: number;
      salesVolume: number;
    }[];
  }>('/saleForecast/selectSaleDetailsForm');

  const loadMore = useCallback(
    (pageNo: number) => {
      return request({
        pageNo,
      });
    },
    [request],
  );

  return (
    <InfiniteTable
      columns={[
        { name: 'batteryName', label: '出货类型-电芯' },
        { name: 'salesVolume', label: '销售量(Gwh)' },
        { name: 'salesQuantity', label: '销售额(百万元)' },
      ]}
      loadMore={loadMore}
    />
  );
}
```
