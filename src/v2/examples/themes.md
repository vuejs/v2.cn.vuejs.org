---
title: 主题
type: examples
is_new: true
order: 13
---
> 通过合作伙伴 [Creative Tim](https://creative-tim.com?affiliate_id=116187) 创建的例子，你可以在一个真实的应用中看到它是如何构建起来的，它背后的技术栈以及你学到的大部分概念。

{% raw %}
<div id="themes-example" class="themes-grid">
   <div v-for="product in products" :key="product.name" class="item-preview">
     <a class="item-preview-img" :href="`https://www.creative-tim.com/product/${product.name}?affiliate_id=${affiliateId}`" rel="nofollow">
     <img :src="`https://raw.githubusercontent.com/creativetimofficial/public-assets/master/${product.name}/${product.name}.jpg`" :alt="`${product.title} - ${product.description}`"></a>
     <div class="item-preview-title-container">
      <h3 :id="product.name" data-type="theme-product-title" class="item-preview-title" :class="{'free': product.free}">{{product.title}}</h3>
      <b v-if="product.price" class="item-preview-price">{{product.price}}$</b>
     </div>
     <div class="item-preview-description">{{product.description}}</div>
   </div>
   <div class="see-more-container">
    <a :href="`https://www.creative-tim.com/bootstrap-themes/vuejs-themes?affiliate_id=${affiliateId}`"
       class="button white see-more-link">
       查看更多主题
    </a>
   </div>
</div>
<script>
new Vue({
  el: '#themes-example',
  data: {
    affiliateId: 116187,
    products: [
      {
        name: 'vue-argon-design-system',
        title: 'Vue Argon Design System',
        free: true,
        description: 'Free Vue.js Design System'
      },
      {
        name: 'vue-black-dashboard-pro',
        title: 'Vue Black Dashboard Pro',
        free: false,
        price: 59,
        description: 'Premium Vue.js Admin Template'
      },
      {
        name: 'vue-paper-dashboard-2-pro',
        title: 'Vue Paper Dashboard 2 Pro',
        free: false,
        price: 59,
        description: 'Premium Vue.js Admin Template'
      },
      {
        name: 'vue-material-kit',
        title: 'Vue Material Kit',
        free: true,
        description: 'Free Vue.js UI Kit'
      },
      {
        name: 'vue-black-dashboard',
        title: 'Vue Black Dashboard',
        free: true,
        description: 'Free Vue.js Admin Template'
      },
      {
        name: 'vue-now-ui-kit-pro',
        title: 'Vue Now UI Kit Pro',
        free: false,
        price: 79,
        description: 'Premium Vue.js UI Kit'
      },
      {
        name: 'vue-now-ui-dashboard-pro',
        title: 'Vue Now UI Dashboard Pro',
        free: false,
        price: 59,
        description: 'Premium Vue.js Admin Template'
      },
      {
        name: 'vue-now-ui-kit',
        title: 'Vue Now UI Kit',
        free: true,
        description: 'Free Vue.js UI Kit'
      },
      {
        name: 'vue-light-bootstrap-dashboard-pro',
        title: 'Vue Light Bootstrap Dashboard Pro',
        free: false,
        price: 49,
        description: 'Premium Vue.js Admin Template'
      },
      {
        name: 'vue-material-dashboard-pro',
        title: 'Vue Material Dashboard Pro',
        free: false,
        price: 59,
        description: 'Premium Vue.js Admin Template'
      },
      {
        name: 'vue-material-kit-pro',
        title: 'Vue Material Kit Pro',
        free: false,
        price: 89,
        description: 'Premium Vue.js UI Kit'
      },
      {
        name: 'vue-light-bootstrap-dashboard',
        title: 'Vue Light Bootstrap Dashboard',
        free: true,
        description: 'Free Vue.js Admin Template'
      }
    ]
  }
})
</script>
{% endraw %}
