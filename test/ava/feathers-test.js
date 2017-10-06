import test from 'ava'
import {xformQuery} from '../../src/feathers-actions'

test('pre', t => {
  t.deepEqual(
    xformQuery({
      query: {
        limit: 10,
        offset: 10
      }
    }),
    {
      $limit: 10,
      $skip: 10
    }
  )
})
