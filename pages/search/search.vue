<template>
	<view class="search">
		<musichead title='搜索' :icon='true' :iconStyle='true'></musichead>
		<view class="container">
			<scroll-view scroll-y>
				<!-- 搜索框 -->
				<view class="search-search">
					<text class="iconfont iconsearch"></text>
					<input type="text" placeholder="请搜索歌曲" v-model="searchWord" @confirm="getSearchHistory(searchWord)" @input="getSuggest(searchWord)">
					<text class="iconfont iconguanbi" v-show="searchType !=1" @click="removeSearchWord"></text>
				</view>
				<!-- 显示第一个页面 -->
				<block v-if="searchType ==1">
					
					<!-- 历史记录 -->
					<view class="search-history">
						<view class="search-history-head" v-if="searchHistory.length>0">
							<text>历史记录</text>
							<text class="iconfont iconlajitong" @click="removeHistory"></text>
						</view>
						<view class="search-history-list">
							<view v-for="(item,index) in searchHistory" :key="index" @click="goToWord(item)">{{item}}</view>
						</view>
					</view>
					<!-- 热搜 -->
					<view class="search-hot">
						<view class="search-hot-head">热搜榜</view>
						<view class="search-hot-item" v-for="(item,index) in hot" :key="index" @click="goToWord(item.searchWord)">
						<view class="search-hot-left">{{index+1}}</view>
						<view class="search-hot-middle">
							<view>{{item.searchWord}} <img :src="item.iconUrl" ></view>
							<view>{{item.content}}</view>
						</view>
						<text class="search-hot-count">{{item.score}}</text>
						</view>
					</view>
				</block>
				<!-- 显示第二个页面 -->
				<block v-else-if="searchType ==2">
					<view class="search-result">
						<view class="search-result-item" v-for="(item,index) in searchList" :key="item.id" @click="goToDetail(item.id)">
							<view class="search-result-word">
								<view>{{item.name}}</view>
								<view>{{item.ar[0].name}}--{{item.al.name}}</view>
							</view>
							<text class="iconfont iconbofang"></text>
						</view>
					</view>
				</block>
				<!-- 显示第三个页面 -->
				<block v-else-if="searchType==3">
					<view class="search-suggest">
						<view class="search-suggest-head">搜索“{{ searchWord }}”</view>
						<view class="search-suggest-item" v-for="(item,index) in searchSuggest" :key="index" @click="goToWord(item.keyword)">
							<text class="iconfont iconsearch"></text> {{ item.keyword }}
						</view>
						
					</view>
				</block>
			</scroll-view>
		</view>	
	</view>
</template>

<script>
	import musichead from '@/components/musichead/musichead.vue'
	export default {
		data() {
			return {
				hot:[],
				searchWord:'',
				searchHistory:[],
				searchType:1,
				searchList:[],
				searchSuggest:[]
			};
		},
		components:{
			musichead
		},
		onLoad() {
			this.getHot()
			// this.getSearchRes(this.searchWord)
			// 页面一加载，就获取本地存储，展示历史记录数据
			uni.getStorage({
				key:'searchHistory',
				success: (res) => {
					this.searchHistory = res.data
				}
			})
		},
		methods:{
			// 删除输入框内容
			removeSearchWord(){
				this.searchWord = ''
				this.searchType = 1
			},
			// 跳转到详情页
			goToDetail(songId){
				uni.navigateTo({
					url:'/pages/detail/detail?songId='+songId
				})
			},
			// 搜索下拉接口	http://localhost:3000/search/suggest?keywords=少年&type=mobile
			async getSuggest(searchWord){
				let res = await this.$myRequest({
					url:`/search/suggest?keywords=${searchWord}&type=mobile`
				})
				console.log(res)
				this.searchSuggest = res.data.result.allMatch
				this.searchType = 3
			},
			// 搜索热搜榜接口		http://localhost:3000/search/hot/detail',
			async getHot(){
				let res = await this.$myRequest({
					url:'/search/hot/detail'
				})
				// console.log(res)
				this.hot = res.data.data
			},
			// 点击事件
			goToWord(word){
				this.searchWord = word
				this.getSearchHistory(word)
			},
			// 搜索结果接口		http://localhost:3000/search/?keywords=许嵩
				async getSearchRes(searchWord){
					let res = await this.$myRequest({
						url:'/search/?keywords='+searchWord
					})
					// console.log(res)
					this.searchList = res.data.result.songs
					// 切换页面
					this.searchType =2
				},
			// 删除历史记录
			removeHistory(){
				uni.removeStorage({
					key:'searchHistory',
					success: (res) => {
						this.searchHistory = []
					}
				})
			},
			
			// 键盘按下事件
			getSearchHistory(searchWord){
				// 将参数添加到数组
				// 需要判断输入的内容是否为空
				if(this.searchWord == ''){
					uni.showToast({
						title:'内容不能为空',
						
					})
					return
				}
				this.searchHistory.unshift(searchWord)
				// 去重
				this.searchHistory = [...new Set(this.searchHistory)]
				// 限制搜索数量为10
				if(this.searchHistory.length >10){
					this.searchHistory.length = 10
				}
				// 本地存储
				uni.setStorage({
					data:this.searchHistory,
					key:'searchHistory'
				})
				// 按下回车后，删除输入的内容
				// this.searchWord=''
				// 再次调用getsearchres方法，并传递参数
				this.getSearchRes(searchWord)
				
			}
		}
		
	}
</script>

<style lang="scss">
.search{
	.search-search{
		display: flex;
		height: 70rpx;
		line-height: 70rpx;
		background: #f7f7f7;
		border-radius: 70rpx;
		margin: 70rpx 30rpx 30rpx 30rpx;
		text{
			margin: 0 26rpx 0 26rpx;
			font-size: 26rpx;
		}
		input{
			flex: 1;
			font-size: 28rpx;
			margin-top: 12rpx;
		}
	}
	.search-history{
		margin: 0 30rpx;
		font-size: 26rpx;
		.search-history-head{
			display: flex;
			justify-content: space-between;
			margin-bottom: 30rpx;
			
		}
		.search-history-list{
			display: flex;
			flex-wrap: wrap;
			view{
				background-color: #f7f7f7;
				padding: 16rpx 26rpx;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				border-radius: 40rpx;
			}
		}
	}
	.search-hot{
		margin: 20rpx 30rpx ;font-size: 26rpx;
		.search-hot-head{
			margin-bottom: 36rpx;
		}
		.search-hot-item{
			display: flex;margin-bottom: 58rpx;
			align-items: center;
			
			.search-hot-left{
				color: #fb2222;width: 60rpx;margin-left: 8rpx;
			}
			.search-hot-middle{
				flex: 1;
				view:nth-child(1){
					font-size: 30rpx;color: #000;margin-right: 10rpx;
				}
				view:nth-child(2){
					font-size: 26rpx;color: #878787;
				}
				img{
					width: 48rpx;height: 22rpx;margin-left: 10rpx;
				}
			}
			.search-hot-count{
				color: #878787;
			}
		}
	}
	.search-result{ border-top:2rpx #e4e4e4 solid; padding:30rpx;}
	.search-result-item{ display: flex; justify-content: space-between; align-items: center; padding-bottom: 30rpx; margin-bottom: 30rpx; border-bottom:2rpx #e4e4e4 solid;}
	.search-result-word{}
	.search-result-word view:nth-child(1){ font-size:28rpx; color:#235790; margin-bottom: 12rpx;}
	.search-result-word view:nth-child(2){ font-size:22rpx; color:#898989;}
	.search-result-item text{ font-size:50rpx;}
	
	.search-suggest{ border-top:2rpx #e4e4e4 solid; padding:30rpx; font-size:26rpx;}
	.search-suggest-head{ color:#4574a5; margin-bottom:74rpx;}
	.search-suggest-item{ color:#5d5d5d; margin-bottom:74rpx;}
	.search-suggest-item text{ color:#bdbdbd; margin-right:28rpx; position: relative; top:2rpx;}
}
</style>
