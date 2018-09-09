;((global, fn) => {
	global.gmfetch = fn(typeof GM === 'undefined' ? {} : GM)
})(this, GM => {
	if (typeof GM_xmlhttpRequest === 'undefined' && typeof GM.xmlHttpRequest === 'undefined') {
		throw new Error('Either GM_xmlhttpRequest or GM.xmlHttpRequest must exists!')
	}
	if (typeof GM_xmlhttpRequest === 'function' && !GM.xmlHttpRequest) {
		GM.xmlHttpRequest = GM_xmlhttpRequest
	}
	class Response {
		constructor(xhr, init) {
			this.xhr = xhr
			this.init = init
		}
		async arrayBuffer() {
			return this.xhr.response
		}
		async blob() {
			return new Blob([this.xhr.response])
		}
		async formData() {
			// I don't know what does this method do...
			throw new Error('No implemented!')
		}
		async json() {
			return JSON.parse(await this.text())
		}
		async text() {
			const td = new TextDecoder()
			return td.decode(this.xhr.response)
		}
		clone() {
			return Object.assign({}, this)
		}
		redirect() {
			/// ???
			return this.clone()
		}
		get ok() {
			return this.xhr.status >= 200 && this.xhr.status < 300
		}
		get headers() {
			return new Headers(this.xhr.headers)
		}
		get status() {
			return this.xhr.status
		}
		get statusText() {
			return this.xhr.statusText
		}
		get type() {
			// gmxhr is always cors
			return 'cors'
		}
		get url() {
			return this.init.url
		}
		get bodyUsed() {
			return this.xhr.method.toUpperCase() !== 'GET'
		}
		get redirected() {
			// ???
			return true
		}
		get useFinalURL() {
			// ???
			return true
		}
	}
	const fetch = (input, init = {}) =>
		new Promise(res => {
			init = Object.assign(
				{
					method: 'GET',
					headers: {}
				},
				init,
				{
					url: input,
					responseType: 'arrayBuffer'
				}
			)
			GM.xmlHttpRequest(
				Object.assign({}, init, {
					onload: xhr => res(new Response(xhr, init)),
					onerror: xhr => res(new Response(xhr, init))
				})
			)
		})
	return fetch
})
