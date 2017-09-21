import _ from 'lodash'
import axios from 'axios'

const authPath = 'defaults.headers.common.Authorization'

export function setToken(token) {
  _.set(axios, authPath, `Bearer ${token}`)
}

export function unsetToken() {
  _.unset(axios, authPath)
}
