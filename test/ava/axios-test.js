import test from 'ava'
import axios from 'axios'
import {webHelpr} from '../../src'

test('setToken', (t) => {
	const token = 's3cret'
	webHelpr.setToken(token)
	t.is(`Bearer ${token}`, axios.defaults.headers.common.Authorization)
	webHelpr.unsetToken()
	t.falsy(axios.defaults.headers.common.Authorization)
})
