import { Helmet } from 'umi';
import useRouteMatch from '@/hooks/useRouteMatch';

const AppHelmet = () => {
  const match = useRouteMatch();
  // console.log(' AppHelmet ： ', match);
  return (
    <Helmet>
      <title>{match.title}</title>
    </Helmet>
  );
};

export default AppHelmet;
