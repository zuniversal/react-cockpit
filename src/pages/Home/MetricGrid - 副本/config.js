import metricsofcapacity from '../../../apps/metricsofcapacity/icon.svg'
import metricsofdeliveryreached from '../../../apps/metricsofdeliveryreached/icon.svg'
import metricsofenergyconsumptioncost from '../../../apps/metricsofenergyconsumptioncost/icon.svg'
import metricsofgrossprofitamount from '../../../apps/metricsofgrossprofitamount/icon.svg'
import metricsofinventoryanalysis from '../../../apps/metricsofinventoryanalysis/icon.svg'
import metricsoflaborcost from '../../../apps/metricsoflaborcost/icon.svg'
import metricsofmanstructure from '../../../apps/metricsofmanstructure/icon.svg'
import metricsofmanufacturing from '../../../apps/metricsofmanufacturing/icon.svg'
import metricsofmarefficiencyanalysis from '../../../apps/metricsofmarefficiencyanalysis/icon.svg'
import metricsofmarefficiencyanalysisxm from '../../../apps/metricsofmarefficiencyanalysisxm/icon.svg'
import metricsofmarfaultanalysis from '../../../apps/metricsofmarfaultanalysis/icon.svg'
import metricsofmarginalamount from '../../../apps/metricsofmarginalamount/icon.svg'
import metricsofmarketanalysis from '../../../apps/metricsofmarketanalysis/icon.svg'
import metricsofmarketmaterialpricetrends from '../../../apps/metricsofmarketmaterialpricetrends/icon.svg'
import metricsofmarloadanalysis from '../../../apps/metricsofmarloadanalysis/icon.svg'
import metricsofmarworkorderanalysis from '../../../apps/metricsofmarworkorderanalysis/icon.svg'
import metricsofproductcosts from '../../../apps/metricsofproductcosts/icon.svg'
// // import a from '../../../apps/a/icon.svg'
// // import aa from '../../../apps/aa/icon.svg'
// // import AAA from '../../../apps/AAA/icon.svg'
import metricsofsales from '../../../apps/metricsofsales/icon.svg'
import metricsofwastagecost from '../../../apps/metricsofwastagecost/icon.svg'
import metricsofyieldanalysis from '../../../apps/metricsofyieldanalysis/icon.svg'
// import icon from '../../../assets/metricsicons/m0001.svg'

const iconMap = {
  metricsofsales,
  metricsofgrossprofitamount,
  metricsofmarginalamount,
  metricsofmarketmaterialpricetrends,
  metricsofmanufacturing,
  metricsofdeliveryreached,
  metricsofproductcosts,
  metricsofmarketanalysis,
  metricsofinventoryanalysis,
  metricsofwastagecost,
  metricsofmanstructure,
  metricsofmarworkorderanalysis,
  metricsofmarefficiencyanalysis,
  metricsofenergyconsumptioncost,
  metricsoflaborcost,
  metricsofyieldanalysis,
  metricsofcapacity,
  metricsofmarloadanalysis,
  metricsofmarfaultanalysis,
  metricsofmarefficiencyanalysisxm,
}

export const formatData = (data) => {
  console.log(' formatData data ： ', data)
  return data.map((item) => ({
    ...item,
    children: item.children.map((v) => {
      const metricId = v.frontComponent.slice('/metrics/'.length)
      return {
        ...v,
        icon: iconMap[metricId],
      }
    }),
  }))
}

export const formatGridData = (data) => {
  console.log(' formatGridData data ： ', data)
  const { appList, followList } = data
  return appList.map((metricItem) => ({
    ...metricItem,
    focusList: followList.filter((v) => v.parentId === metricItem.id),
  }))
}

export const preventSelect = () => {
  //ios
  document.oncontextmenu = function (e) {
    e.preventDefault()
  }
  document.onselectstart = function (e) {
    e.preventDefault()
  }
  //安卓
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault()
  })
}
