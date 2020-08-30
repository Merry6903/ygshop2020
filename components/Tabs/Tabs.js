// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTabClick:function(e){
      const id = e.currentTarget.dataset.id;
      let { tabs } = this.data;
      tabs.forEach(v => v.id == id ? v.isActive=true:v.isActive=false);
      this.setData({
        tabs
      });
      this.triggerEvent("tabsChange",tabs)
    }
  }
})
