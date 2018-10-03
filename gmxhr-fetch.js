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
			this._bodyUsed = false
		}
		get _arrayBuffer() {
			const te = new TextEncoder()
			return te.encode(this.xhr.response)
		}
		arrayBuffer() {
			this._bodyUsed = true
			return Promise.resolve(this._arrayBuffer)
		}
		blob() {
			this._bodyUsed = true
			return Promise.resolve(new Blob([this._arrayBuffer]))
		}
		formData() {
			this._bodyUsed = true
			// I don't know what does this method do...
			throw new Error('Not implemented!')
		}
		json() {
			this._bodyUsed = true
			return Promise.resolve(JSON.parse(this.xhr.response))
		}
		text() {
			this._bodyUsed = true
			return Promise.resolve(this.xhr.response)
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
			return this._bodyUsed
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
					responseType: 'text'
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
