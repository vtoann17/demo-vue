import { createStore } from 'vuex'
import cart from './cart.js'

const store = createStore({
  modules: {
    cart: {
      namespaced: true,
      ...cart
    }
  }
})

export default store
