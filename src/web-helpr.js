import _ from 'lodash'
import axios from 'axios'

const authPath = 'defaults.headers.common.Authorization'

export function setToken(token) {
	_.set(axios, authPath, `Bearer ${token}`)
}

export function unsetToken() {
	_.unset(axios, authPath)
}

export function setWithCredentials(value) {
	axios.defaults.withCredentials = value
}

// https://github.com/auth0/node-jsonwebtoken/issues/68#issuecomment-327455866
export function formatPublicKey({key}) {
	const beginKey = `-----BEGIN PUBLIC KEY-----`
	const endKey = `-----END PUBLIC KEY-----`

	const sanatizedKey = key
		.replace(beginKey, '')
		.replace(endKey, '')
		.replace('\n', '')

	const keyArray = sanatizedKey.split('').map((l, i) => {
		const position = i + 1
		const isLastCharacter = sanatizedKey.length === position
		if (position % 64 === 0 || isLastCharacter) {
			return l + '\n'
		}

		return l
	})

	return `${beginKey}\n${keyArray.join('')}${endKey}\n`
}

export function dbgReq({dbg, req}) {
	dbg(
		'[%s]%s: params=%o, query=%o, body=%o, user=%o, session=%o',
		req.method,
		req.path,
		req.params,
		req.query,
		req.body,
		req.user,
		req.session
	)
}

export function combine({req}) {
	const params = _.transform(req.params, (result, value, key) => {
		const _key = key === '_id' ? key : _.replace(key, '_', '.')
		return (result[_key] = value) // eslint-disable-line no-return-assign
	})

	return {
		...req.query,
		...params
	}
}

export function forward({req, res, next, router, id}) {
	req.url = id ? `/${id}` : '/'
	req.query = combine(req)
	router(req, res, next)
}
