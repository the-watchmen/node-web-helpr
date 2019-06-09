import assert from 'assert'
import _ from 'lodash'
import debug from 'debug'
import {stringify} from '@watchmen/helpr'
import getActions from './rest-actions'

const dbg = debug('lib:web-helpr:feathers-actions')

const wildIn = '*'
const re = new RegExp(`\\${wildIn}`, 'g')
const wildOut = '%'

export default function({url, resource}) {
	const actions = getActions({url, resource})

	return {
		...actions,
		index: async ({query}) => {
			const result = await actions.index({query: xformQuery({query})})
			assert(result.data, `unexpected result=${stringify(result)}`)
			const {data} = result
			if (!data.data) {
				throw new Error(data.message || stringify(data))
			}

			// Feathers results look like: {total: 0, limit: 5, skip: 0, data: []}
			//
			return {
				data: data.data,
				total: data.total,
				query
			}
		}
	}
}

export function xformQuery({query}) {
	dbg('xform-query: query=%o', query)
	return _.transform(query, (result, val, key) => {
		if (key === 'offset') {
			result.$skip = val
		} else if (key === 'limit') {
			result.$limit = val
		} else if (val && _.isString(val) && val.indexOf(wildIn) >= 0) {
			result[`${key}[$like]`] = val.replace(re, wildOut)
		} else if (key === 'sort' && val) {
			val.field && (result[`$sort[${val.field}]`] = val.isAscending ? 1 : -1)
		} else {
			result[key] = val
		}
	})
}
