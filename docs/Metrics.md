# 指标开发说明

每一个指标都是一个微应用，在项目文件架构上是`apps`目录下的一个文件夹，文件夹名称就是微应用id，指标id对应微应用id（目前是
等价的，后续可能会调整）。比如**销售额**这个指标，指标id是`metricsofsales`，对应的目录是`src/apps/metricsofsales`。


## 静态配置
***⚠️即将废弃，迁移到从动态接口获取***

目前预制了4个微应用，静态配置在`src/contexts/user/UserProvider.tsx`，后面会改成从接口动态获取，配置示例：

```tsx
{
  // metricId,　指标id
  metricId: 'metricsofsales',
  // appName，微应用id，目前等价于指标id，对应src/apps目录下的一个文件夹
  appName: 'metricsofsales',
  // 指标卡片的标题
  title: '销售额1',
  // 显示在指标库里的图标
  icon: require('../../assets/metricsicons/m0001.svg'),
}
```


## 入口文件

指标微应用的入口文件是目录下的`index.tsx`，入口文件需要`export default`一个React组件，比如：

```tsx
import { CurrentAppContext } from '../../contexts/apps/CurrentAppContext'
import { CardMode } from './CardMode'
import { DetailMode } from './DetailMode'

/**
 * 这里的函数名称Market不是约定的，可以改成指标对应的英文
 */
export default function Market(props) {
  /**
   * 从props里拿到mode参数 
   */
  const { mode } = props
  return (
    <CurrentAppContext.Provider value={props}>
      {/*渲染卡片样式*/}
      {mode === 'card' && <CardMode />}

      {/*渲染详情页样式*/}
      {mode === 'detail' && <DetailMode />}
    </CurrentAppContext.Provider>
  )
}

```

## 参数

指标微应用加载的时候，会传入一些props给微应用，包括：

|prop|类型|说明|
|-|-|-|
|`mode`| 'card' \| 'detail'| 渲染模式，在首页加载微应用时，mode为card，此时组件渲染card样式的结果，mode为detail时，渲染详情页的结果。此后可能会补充
|`navigateToDetail`| `(params?: Record<string, string>) => void` | 跳转到详情页的方法，params是需要传递给详情页的参数，可以不传。


## 本地开发

本地开发的时候，首先在src/apps目录下创建名称以`metrics`开头的文件夹（如`metricsofsales`），再创建如上所述的入口文件`index.tsx`。

启动项目后，打开 <http://localhost:8090/metrics/metricsofsales/card> 即开发卡片页，
打开 <http://localhost:8090/metrics/metricsofsales/detail> 即开发详情页。

## 数据获取

使用`useQuery`可以快速获取远程数据，示例：

```tsx
import { ErrorBlock, DotLoading } from 'antd-mobile'
import { userQuery } from '../../hooks/useQuery'

export function CardMode(props){
  // 分类销售总额
  const { error, data, query } = useQuery('/saleForecast/selectSaleClassify',props.id)
  const [ param1, setParam1 ] = useState('any')

  useEffect(() => {
    /**
     * 日期参数(chooseDate)和年月日(dateType)参数都已经封装好了，不用传
     */
    query({ param1 })
  }, [query, param1])

  if (error) {
    return (
      <ErrorBlock status="default" description={error.message} />
    )
  }

  if (!data) {
    return <DotLoading />
  }

  return <Plot data={data} />
}

```