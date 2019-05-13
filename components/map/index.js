// components/map/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     positon: {
       type: Object,
       value: {
         latitude:'',
         longitude :''
       },
       observer: (newVal, oldVal)=>{
         this.setData({
           latitude: newVal.latitude,
           longitude: newVal.longitude
         })
       }
     },
     points: {
       type:Array
     },
     markers: {
       type:Array
     }
  },

  /**
   * 组件的初始数据
   */
  data: {
    longitude: '',
    longitude: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
