import { useReq } from '../../../hooks/useReq'
import { updateSort } from '../../../services/home'

export default () => {
  const { data: userInfo, error, run: updateSortAsync } = useReq(updateSort)
  console.log(' userInfo ： ', userInfo, error) //

  return {
    updateSortAsync,
  }
}
