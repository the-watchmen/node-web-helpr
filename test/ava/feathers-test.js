import test from 'ava'
import {xformQuery} from '../../src/feathers-actions'

test('pre', t => {
	t.deepEqual(
		xformQuery({
			query: {
				limit: 10,
				offset: 10,
				foo: 'bar*baz'
			}
		}),
		{
			$limit: 10,
			$skip: 10,
			'foo[$like]': 'bar%baz'
		}
	)
})
