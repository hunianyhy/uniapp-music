// 引入baseUrl
import { baseUrl} from './config.js'

// 发请求
export function topList(){
	let listIds = ['19723756','3779629','2884035','3778678']
	return new Promise((resolve,reject)=>{
		uni.request({
			url:`${baseUrl}/toplist/detail`,
			method:'GET',
			success: (res) => {
				let result = res.data.list
				result.length = 4
				for(let i=0;i <listIds.length; i++){
					result[i].listId = listIds[i]
				}
				resolve(result)
			}
		})
	})
}