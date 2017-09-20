import test from 'ava'
import jwt from 'jsonwebtoken'
import debug from 'debug'
import {formatPublicKey} from '../../src/index'

const dbg = debug('test:jwt')

const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJnbXZkbkNrZE9NSTg5OGtKMWFMTkExYkRldDJnSVYzZEFKLVctb1RqTk44In0.eyJqdGkiOiJlMzNiY2RlMS00MTUzLTRkZmEtODVjNS1hZjY1ZTg4YWY1MDMiLCJleHAiOjE1MDU4NjY4NDYsIm5iZiI6MCwiaWF0IjoxNTA1ODY1OTQ2LCJpc3MiOiJodHRwczovL2F1dGgubGFiLmRzLmFldG5hLmNvbS9hdXRoL3JlYWxtcy9yZWFsbS0xIiwiYXVkIjoiY2xpZW50LTEiLCJzdWIiOiI5NzUyYWRjYS0wOTllLTQ4MTAtODM4Yi1kYjQ1MjRkZWU2ODgiLCJ0eXAiOiJJRCIsImF6cCI6ImNsaWVudC0xIiwibm9uY2UiOiIxNTA1ODY1OTIzNzQ2IiwiYXV0aF90aW1lIjoxNTA1ODY1OTQ2LCJzZXNzaW9uX3N0YXRlIjoiNDk4Mjk3NDAtOTk4YS00OTU4LTg4MmItYTVlZTdlYWRlNWNlIiwiYXRfaGFzaCI6Ikl4UFFueTlmcWlYdlZHR3pUUG1tQ3ciLCJhY3IiOiIxIiwiZ3JvdXBzIjpbImdyb3VwLTEiXSwicHJlZmVycmVkX3VzZXJuYW1lIjoidXNlci0xIn0.Q7DJan9OQqs7kKDE9UgjFdiRtvgpTPs7lMTRztsviLRISSOqOPhE59WCasbbhFdtUjUIp9reHXc0UE1NEp0TEV62MVo-12IcKF1l2Q8dxxsw5kkyRLlvVgJFa3KnnT5XHMaI2iRp8O-_xXR0rDJnhpkvL2pAkuS-KHYkpQYwtQyETe_H34uzBImyAsjcbbY9828fpDmtJlbIZX2fMdkNSu9KRQ7hjcnA34reeJlkHMH-L3GmUFc7cpR9laQ9xRRhCoQWBwd3DVLzmhy_fEAKtTl-wPKM1EUybUwXVvK14OLmoUWxvD0f_oK2oFyQltBoKvjgTCvCHfMx8ysIvgyl2A'
const secret = formatPublicKey({
  key:
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiJVhAMEY4rllFv9KgWh2/eo2MIx80KlCnpiZZC+K97tPqTglNwgh9YIGro5j178EgBBA3LlRZrTrfV6MSSZT3gnPsypEn/Yx9pVPc1zsPDLFoUSgclg1VafXvh9JuhE1n7i3LunV0b6hwTInXB0nQPZLiCM9w494DShQ830necoGL3mWwcJV+WuTBQrq1cDYpuYxiFdONMAqywslgbEtob9OYeknvTqLvtd6iLNWut/b91bkQnXR6mKNAWt+avvLg3H2W5dpy/+HL2yjWfFdGEkdwglg2Li9IhuEYaWhH3ki8BTMkngUNb/gPnCvtkk1spwdexSbMPb5QJpsEbubkwIDAQAB'
})
const algorithms = ['RS256']
const options = {algorithms, ignoreExpiration: true}

test('verify', t => {
  const decoded = jwt.verify(token, secret, options)
  dbg('decoded=%o', decoded)
  t.is(decoded.aud, 'client-1')
})

test('verify: fail', t => {
  const err = t.throws(() => {
    jwt.verify(token, 'wrong-secret', options)
  })
  dbg('err=%o', err)
})
