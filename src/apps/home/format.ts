import m0001 from '../../assets/metricsicons/m0001.svg';
import metricsofcapacity from '../metricsofcapacity/icon.svg';
import metricsofdeliveryreached from '../metricsofdeliveryreached/icon.svg';
import metricsofenergyconsumptioncost from '../metricsofenergyconsumptioncost/icon.svg';
import metricsofgrossprofitamount from '../metricsofgrossprofitamount/icon.svg';
import metricsofinventoryanalysis from '../metricsofinventoryanalysis/icon.svg';
import metricsoflaborcost from '../metricsoflaborcost/icon.svg';
import metricsofmanstructure from '../metricsofmanstructure/icon.svg';
import metricsofmanufacturing from '../metricsofmanufacturing/icon.svg';
import metricsofmarefficiencyanalysis from '../metricsofmarefficiencyanalysis/icon.svg';
import metricsofmarefficiencyanalysisxm from '../metricsofmarefficiencyanalysisxm/icon.svg';
import metricsofmarfaultanalysis from '../metricsofmarfaultanalysis/icon.svg';
import metricsofmarginalamount from '../metricsofmarginalamount/icon.svg';
import metricsofmarketanalysis from '../metricsofmarketanalysis/icon.svg';
import metricsofmarketmaterialpricetrends from '../metricsofmarketmaterialpricetrends/icon.svg';
import metricsofmarloadanalysis from '../metricsofmarloadanalysis/icon.svg';
import metricsofmarworkorderanalysis from '../metricsofmarworkorderanalysis/icon.svg';
import metricsofproductcosts from '../metricsofproductcosts/icon.svg';
// // import a from '../a/icon.svg'
// // import aa from '../aa/icon.svg'
// // import AAA from '../AAA/icon.svg'
import metricsofsales from '../metricsofsales/icon.svg';
import metricsofwastagecost from '../metricsofwastagecost/icon.svg';
import metricsofyieldanalysis from '../metricsofyieldanalysis/icon.svg';

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
};

export const formatList = (data) => {
  console.log(' formatList   ,   ： ', data);
  return data.map((item) => {
    if (!item.frontComponent) {
      return item;
    }
    const { frontComponent, indicatorName: title, indicatorDesc: desc } = item;

    const metricId = frontComponent.slice('/metrics/'.length);
    const icon = iconMap[metricId] ? iconMap[metricId] : m0001;
    return {
      ...item,
      title,
      icon,
      metricId,
      appName: metricId,
      desc,
    };
  });
};
