const baseUrl = 'http://localhost:3000'

export const myRequest = (options)=>{
	return new Promise((resolve,reject)=>{
		uni.request({
			url: baseUrl + options.url,
			method: options.methods || 'GET',
			data: options.data || {},
			success: res => {
				if(res.data.code!==200){
					return uni.showToast({
						title:'获取数据失败'
					})
				}
				resolve(res)
			},
			fail: (err) => {
				uni.showToast({
					title:'请求接口失败'
				})
				reject(err)
			},
		});
	})
}