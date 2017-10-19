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
