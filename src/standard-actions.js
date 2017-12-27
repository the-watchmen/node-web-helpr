import assert from 'assert'
import _ from 'lodash'
import debug from 'debug'
import {stringify, toDotNotation} from '@watchmen/helpr'
import getActions from './rest-actions'

const dbg = debug('lib:web-helpr:standard-actions')

export default function({url, resource}) {
  const actions = getActions({url, resource})

  return {
    ...actions,
    index: async ({query}) => {
      const result = await actions.index({query: xformQuery({query})})
      assert(result.data, `unable to extract data from result=${stringify(result)}`)
      const {data} = result

      return {
        data,
        // x-total-count optional...
        total: result.headers['x-total-count'],
        query
      }
    }
  }
}

export function xformQuery({query}) {
  dbg('xform-query: query=%o', query)
  return _.transform(query, (result, val, key) => {
    dbg('xform-query: result=%o, val=%o, key=%o', result, val, key)
    if (key === 'sort' && val) {
      val.field && (result.sort = val.isAscending ? val.field : `-${val.field}`)
    } else if (_.isObject(val)) {
      // https://stackoverflow.com/questions/47536618/is-there-any-way-to-have-redux-form-ignore-dots-in-a-field-name/47624233
      const dotted = toDotNotation({target: {[key]: val}})
      dbg('xform-query: dotted=%o', dotted)
      const _key = _.keys(dotted)[0]
      result[_key] = dotted[_key]
    } else {
      result[key] = val
    }
  })
}
