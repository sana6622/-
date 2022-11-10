
// API 說明：https://api.kcg.gov.tw/ServiceList/Detail/9c8e1450-e833-499c-8320-29b36b7ace5c
// API 路徑：https://api.kcg.gov.tw/api/service/Get/9c8e1450-e833-499c-8320-29b36b7ace5c
// 備用 API：https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json
const jsonUrl = 'https://api.kcg.gov.tw/api/service/Get/9c8e1450-e833-499c-8320-29b36b7ace5c';
const content = document.getElementById('content');
const pageid = document.getElementById('pageid');

const app = Vue.createApp({
  data() {
    return {
      dataList: [],//全部資料
      pageList: [],//新的資料
      pageTotal: '',//總頁數
      pagenumber: 1,

    }
  },

  methods: {
    getData() {
      axios.get(jsonUrl)
        .then(res => {
          this.dataList = res.data.data.XML_Head.Infos.Info
          this.getPage(this.dataList, 1)
        }).catch(err => console.log('jsonUrl error'))
    },
    getPage(dataList, nowPage) {

      // 取得全部資料長度
      pageNum = dataList.length
      perpage = 20  //每頁幾個

      this.pageTotal = Math.ceil(pageNum / perpage)
      // 當前頁數，對應現在當前頁數
      currentPage = nowPage
      // 因為要避免當前頁數筆總頁數還要多，假設今天總頁數是 3 筆，就不可能是 4 或 5
      // 所以要在寫入一個判斷避免這種狀況。
      // 當"當前頁數"比"總頁數"大的時候，"當前頁數"就等於"總頁數"
      // 注意這一行在最前面並不是透過 nowPage 傳入賦予與 currentPage，所以才會寫這一個判斷式，但主要是預防一些無法預期的狀況
      if (currentPage > this.pageTotal) {
        currentPage = pageTotal
      }
      //第三頁 20*(3-1)+1=41
      minData = perpage * (currentPage - 1)
      maxData = perpage * currentPage
      //每頁資料
      this.pageList = this.dataList.slice(minData, maxData)

        ;

    },
    changePageNum(pages) {
      console.log(pages)
      this.pagenumber = pages

      this.getPage(this.dataList, this.pagenumber)
    },
    //前一頁
    prePage() {
      if (this.pagenumber > 1) {
        this.pagenumber = this.pagenumber - 1
        this.getPage(this.dataList, this.pagenumber)
      }
    },
    //下一頁
    nextPage() {
      if (this.pagenumber < this.pageTotal) {
        this.pagenumber = this.pagenumber + 1
        this.getPage(this.dataList, this.pagenumber)
      }
    },

  },

  created() {
    this.getData()

  },
})


app.component('card', {
  props: ['cards'],
  template:
    `   
  <div class=" col-sm-6 col-md-4 col-xl-3 py-2  " v-for="(item,i) in cards" :key="'itemNum'+i">      
   <div class="card">
    <div class="card bg-dark text-white text-left">
      <img class="card-img-top  img-cover" :src="item.Picture1" alt="">

      <div class="card-img-overlay d-flex justify-content-between align-items-end p-0 px-3 "
        style="background-color:rgba(0,0,0,0.2)">
        <h5 class="card-img-title-lg">{{item.Name}}</h5>
        <h5 class="card-img-title-sm">{{item.Zone}}</h5>
      </div>
    </div>

    <div class="card-body text-left">
      <p class="card-text">
        <i class="far fa-clock fa-clock-time"></i>
        &nbsp;{{item.Opentime}}
      </p>
      <p class="card-text"><i class="fas fa-map-marker-alt fa-map-gps"></i>&nbsp;{{item.Add}} </p>
      <p class="card-text"><i class="fas fa-mobile-alt fa-mobile"></i>&nbsp;{{item.Tel}}</p>
     
      <p class="card-text" >
      <i class="fas fa-tags text-warning" v-if="item.Ticketinfo"></i>&nbsp;{{item.Ticketinfo}}      
      </p>
    
    </div>
  </div>
</div>
`
}),


  app.component('page-list', {
    props: ['pagetotal', 'pagenow'],
    emits: ['change-page', 'previous-page', 'nextone-page'],

    template: `
    
    <li class="page-item " :class="{'disabled': pagenow === 1}" v-on:click.prevent="$emit('previous-page')">
    <a class="page-link" href="#" tabindex="-1" >Previous</a>
     </li>
    
    <div v-for='item in pagetotal':key="item" >
    <li class="page-item "  v-on:click.prevent="$emit('change-page',item)" :class="{'active':pagenow===item}">
    <a class="page-link" href="#">{{item}}</a>
    </li> 
    </div>
   
    <li class="page-item"  :class="{'disabled': pagenow === pagetotal}" v-on:click.prevent="$emit('nextone-page')">
    <a class="page-link" href="#" >Next</a>
                </li>
     
    `
  })

app.mount('#app');
