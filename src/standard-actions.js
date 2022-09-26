import assert from 'node:assert'
import _ from 'lodash'
import debug from 'debug'
import {stringify, toDotNotation} from '@watchmen/helpr'
import getActions from './rest-actions.js'

const dbg = debug('lib:web-helpr:standard-actions')

export default function ({url, resource}) {
	const actions = getActions({url, resource})

	return {
		...actions,
		async index({query}) {
			const result = await actions.index({query: xformQuery({query})})
			assert(result.data, `unable to extract data from result=${stringify(result)}`)
			const {data} = result

			return {
				data,
				// X-total-count optional...
				// eslint-disable-next-line radix
				total: Number.parseInt(result.headers['x-total-count']),
				query
			}
		}
	}
}

export function xformQuery({query}) {
	dbg('xform-query: query=%o', query)
	return _.transform(query, (result, value, key) => {
		dbg('xform-query: result=%o, val=%o, key=%o', result, value, key)
		if (key === 'sort' && value) {
			// eslint-disable-next-line no-unused-expressions
			value.field && (result.sort = value.isAscending ? value.field : `-${value.field}`)
		} else if (_.isObject(value)) {
			// https://stackoverflow.com/questions/47536618/is-there-any-way-to-have-redux-form-ignore-dots-in-a-field-name/47624233
			const dotted = toDotNotation({target: {[key]: value}})
			dbg('xform-query: dotted=%o', dotted)
			const _key = _.keys(dotted)[0]
			result[_key] = dotted[_key]
		} else {
			result[key] = value
		}
	})
}
