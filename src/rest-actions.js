import axios from 'axios'
import debug from 'debug'

const dbg = debug('lib:web-helpr:rest-actions')

export default function ({url, resource}) {
	const _url = `${url}/${resource}`
	const idUrl = (id) => `${_url}/${id}`

	return {
		async index({query}) {
			const result = await axios.get(_url, {params: query})
			dbg('index: url=%o, query=%o, result=%o', _url, query, result)
			return result
		},
		async get({id}) {
			const result = await axios.get(idUrl(id))
			dbg('get: url=%o, id=%o, result=%o', _url, id, result)
			return result.data
		},
		async create({data}) {
			const result = await axios.post(_url, data)
			dbg('create: url=%o, data=%o, result=%o', _url, data, result)
			return result
		},
		async update({id, data}) {
			const result = await axios.put(idUrl(id), data)
			dbg('update: url=%o, id=%o, data=%o, result=%o', _url, id, data, result)
			return result
		},
		async patch({id, data}) {
			const result = await axios.patch(idUrl(id), data)
			dbg('patch: url=%o, id=%o, data=%o, result=%o', _url, id, data, result)
			return result
		},
		async delete({id}) {
			const result = await axios.delete(idUrl(id))
			dbg('delete: url=%o, id=%o, result=%o', _url, id, result)
			return result
		}
	}
}
