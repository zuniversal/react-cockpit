// 对象数组去重
export const filterObjArr = (arr, key) => {
  const newArr = []
  const obj = {}
  for (let i = 0; i < arr.length; i++) {
    if (!obj[arr[i][key]]) {
      newArr.push(arr[i])
      obj[arr[i][key]] = true
    }
  }
  return newArr
}

export const formatData = (data) => {
  const { groups, apps } = data
  console.log(' formatData data ： ', data)
  const indicatorList = groups.map((item) => {
    const groupList = apps.filter((v) => v.groupName === item.groupName)
    const tagListFilter = filterObjArr(groupList, 'labelCode')
    const tagList = tagListFilter.map((item) => ({
      tagName: item.labelName,
      tagCode: item.labelCode,
      metricList: groupList.filter((v) => v.labelCode === item.labelCode),
    }))
    return {
      ...item,
      tagList,
    }
  })
  return {
    ...data,
    indicatorList,
  }
}

export const searchFilter = (data, keyword) => {
  if (!keyword) {
    return data
  }
  const res = { groups: [], apps: [], indicatorList: [] }
  res.apps = data.apps.filter((item) => item.indicatorName.includes(keyword))
  res.groups = data.groups
  // res.groups = data.groups.filter((item) =>
  //   res.apps.map((item1) => item1.parentId).includes(item.groupName)
  // )
  console.log(' data, keyword ： ', data, keyword, res)
  return res
}
