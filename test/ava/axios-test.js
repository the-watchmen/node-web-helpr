import test from 'ava'
import axios from 'axios'
import {axios as axiosHelper} from '../../src'

test('setToken', t => {
  const token = 's3cret'
  axiosHelper.setToken(token)
  t.is(`Bearer ${token}`, axios.defaults.headers.common.Authorization)
  axiosHelper.unsetToken()
  t.falsy(axios.defaults.headers.common.Authorization)
})
