import assert from 'node:assert'
import _ from 'lodash'
import debug from 'debug'
import {stringify} from '@watchmen/helpr'
import getActions from './rest-actions.js'

const dbg = debug('lib:web-helpr:feathers-actions')

const wildIn = '*'
const re = new RegExp(`\\${wildIn}`, 'g')
const wildOut = '%'

export default function ({url, resource}) {
	const actions = getActions({url, resource})

	return {
		...actions,
		async index({query}) {
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
	return _.transform(query, (result, value, key) => {
		if (key === 'offset') {
			result.$skip = value
		} else if (key === 'limit') {
			result.$limit = value
		} else if (value && _.isString(value) && value.includes(wildIn)) {
			result[`${key}[$like]`] = value.replace(re, wildOut)
		} else if (key === 'sort' && value) {
			// eslint-disable-next-line no-unused-expressions
			value.field && (result[`$sort[${value.field}]`] = value.isAscending ? 1 : -1)
		} else {
			result[key] = value
		}
	})
}
