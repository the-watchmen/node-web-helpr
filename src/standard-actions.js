import assert from 'assert'
//import _ from 'lodash'
// import debug from 'debug'
import {stringify} from '@watchmen/helpr'
import getActions from './rest-actions'

// const dbg = debug('lib:web-helpr:standard-actions')

export default function({url, resource}) {
  const actions = getActions({url, resource})

  return {
    ...actions,
    index: async ({query}) => {
      const result = await actions.index({query})
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
