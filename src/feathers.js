import axios from 'axios'
import _ from 'lodash'
import debug from 'debug'

const dbg = debug('lib:web-helpr:feathers')

export function getIndex({url, resource}) {
  const _url = `${url}/${resource}`
  return async function(query) {
    const result = await axios.get(_url, {params: xformQuery(query)})
    dbg('index: url=%o, query=%o, result=%o', _url, query, result)
    // feathers results look like: {total: 0, limit: 5, skip: 0, data: []}
    //
    return {
      data: result.data.data,
      total: result.data.total,
      query
    }
  }
}

export function xformQuery(query) {
  dbg('xform-query: query=%o', query)
  return _.transform(query, (result, val, key) => {
    if (key === 'offset') {
      result['$skip'] = val
    } else if (key === 'limit') {
      result['$limit'] = val
    } else if (val && _.isString(val) && val.indexOf('%') >= 0) {
      result[`${key}[$like]`] = val
    } else if (key === 'sort' && val) {
      result[`$sort[${val.field}]`] = val.isAscending ? 1 : -1
    } else {
      result[key] = val
    }
  })
}
