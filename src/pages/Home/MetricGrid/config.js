import metricsofcapacity from '../../../pages/metricsofcapacity/icon.svg';
import metricsofdeliveryreached from '../../../pages/metricsofdeliveryreached/icon.svg';
import metricsofenergyconsumptioncost from '../../../pages/metricsofenergyconsumptioncost/icon.svg';
import metricsofgrossprofitamount from '../../../pages/metricsofgrossprofitamount/icon.svg';
import metricsofinventoryanalysis from '../../../pages/metricsofinventoryanalysis/icon.svg';
import metricsoflaborcost from '../../../pages/metricsoflaborcost/icon.svg';
import metricsofmanstructure from '../../../pages/metricsofmanstructure/icon.svg';
import metricsofmanufacturing from '../../../pages/metricsofmanufacturing/icon.svg';
import metricsofmarefficiencyanalysis from '../../../pages/metricsofmarefficiencyanalysis/icon.svg';
import metricsofmarefficiencyanalysisxm from '../../../pages/metricsofmarefficiencyanalysisxm/icon.svg';
import metricsofmarfaultanalysis from '../../../pages/metricsofmarfaultanalysis/icon.svg';
import metricsofmarginalamount from '../../../pages/metricsofmarginalamount/icon.svg';
import metricsofmarketanalysis from '../../../pages/metricsofmarketanalysis/icon.svg';
import metricsofmarketmaterialpricetrends from '../../../pages/metricsofmarketmaterialpricetrends/icon.svg';
import metricsofmarloadanalysis from '../../../pages/metricsofmarloadanalysis/icon.svg';
import metricsofmarworkorderanalysis from '../../../pages/metricsofmarworkorderanalysis/icon.svg';
import metricsofproductcosts from '../../../pages/metricsofproductcosts/icon.svg';
// // import a from '../../../pages/a/icon.svg'
// // import aa from '../../../pages/aa/icon.svg'
// // import AAA from '../../../pages/AAA/icon.svg'
import metricsofsales from '../../../pages/metricsofsales/icon.svg';
import metricsofwastagecost from '../../../pages/metricsofwastagecost/icon.svg';
import metricsofyieldanalysis from '../../../pages/metricsofyieldanalysis/icon.svg';
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
};

export const formatData = (data) => {
  console.log(' formatData data ： ', data);
  return data.map((item) => ({
    ...item,
    children: item.children.map((v) => {
      const metricId = v.frontComponent.slice('/metrics/'.length);
      return {
        ...v,
        icon: iconMap[metricId],
      };
    }),
  }));
};

export const formatGridData = (data) => {
  console.log(' formatGridData data ： ', data);
  const { appList, followList } = data;
  return appList.map((metricItem) => ({
    ...metricItem,
    focusList: followList.filter((v) => v.parentId === metricItem.id),
  }));
};

export const preventSelect = () => {
  //ios
  document.oncontextmenu = function (e) {
    e.preventDefault();
  };
  document.onselectstart = function (e) {
    e.preventDefault();
  };
  //安卓
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });
};

export const bounceScroll = function (e) {
  e.preventDefault();
};

export const recoverScroll = () => {
  document.body.style.overflow = 'auto';
  document.body.removeEventListener('touchmove', bounceScroll, {
    passive: false,
  });
};

export const disableScroll = () => {
  document.body.style.overflow = 'hidden';
  document.body.addEventListener('touchmove', bounceScroll, {
    passive: false,
  });
  setTimeout(() => {
    console.log(' 恢复滑动 ： ');
    recoverScroll();
  }, 1000);
};

export const iosBounce = {
  recoverScroll,
  disableScroll,
};
