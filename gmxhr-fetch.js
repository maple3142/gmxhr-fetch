;((global, fn) => {
	global.gmfetch = fn(typeof GM === 'undefined' ? {} : GM)
})(this, GM => {
	if (typeof GM_xmlhttpRequest === 'undefined' && typeof GM.xmlHttpRequest === 'undefined') {
		throw new Error('Either GM_xmlhttpRequest or GM.xmlHttpRequest must exists!')
	}
	if (typeof GM_xmlhttpRequest === 'function' && !GM.xmlHttpRequest) {
		GM.xmlHttpRequest = GM_xmlhttpRequest
	}
	const splitHeaderLine = l => {
		const i = l.indexOf(':')
		return [l.slice(0, i), l.slice(i + 1).trimLeft()]
	}
	const parseHeader = h => Object.fromEntries(h.split('\r\n').filter(Boolean).map(splitHeaderLine))
	const fetch = (input, init = {}) => {
		if (input instanceof Request) {
			return fetch(input.url, Object.assign({}, input, init))
		}
		return new Promise(res => {
			if (init.headers instanceof Headers) {
				init.headers = fromEntries(Array.from(init.headers.entries()))
			}
			init.data = init.body
			init = Object.assign(
				{
					method: 'GET',
					headers: {}
				},
				init,
				{
					url: input,
					responseType: 'blob'
				}
			)
			GM.xmlHttpRequest(
				Object.assign({}, init, {
					onload: xhr => {
						xhr.headers = parseHeader(xhr.responseHeaders)
						res(new Response(xhr.response, Object.assign({}, init, xhr)))
					},
					onerror: xhr => {
						console.log('err', xhr)
						res(new Response(xhr.response, Object.assign({}, init, xhr)))
					}
				})
			)
		})
	}

	return fetch
})
