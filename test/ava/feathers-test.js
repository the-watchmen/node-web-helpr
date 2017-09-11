import test from 'ava'
import {feathers} from '../../src'

test('pre', t => {
  t.deepEqual(
    feathers.xformQuery({
      limit: 10,
      offset: 10
    }),
    {
      $limit: 10,
      $skip: 10
    }
  )
})
