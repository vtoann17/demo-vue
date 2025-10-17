import axios from 'axios'

export default {
  namespaced: true,
  state: () => ({
    cart: JSON.parse(localStorage.getItem('cart') || '[]')
  }),

  getters: {
    cartItems: (state) => state.cart,
    cartCount: (state) => state.cart.reduce((sum, i) => sum + i.quantity, 0),
    cartTotal: (state) => state.cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  },

  mutations: {
    SET_CART(state, cartItems) {
      state.cart = cartItems
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    ADD_TO_CART(state, product) {
      const existing = state.cart.find(i => i.id === product.id)
      if (existing) existing.quantity++
      else state.cart.push({ ...product, quantity: 1 })
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    REMOVE_FROM_CART(state, id) {
      state.cart = state.cart.filter(i => i.id !== id)
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    CLEAR_CART(state) {
      state.cart = []
      localStorage.setItem('cart', '[]')
    }
  },

  actions: {
    async addToCart({ commit, state }, product) {
      commit('ADD_TO_CART', product)
      const user = JSON.parse(localStorage.getItem('currentUser'))
      if (!user) return

      const res = await axios.get(`http://localhost:3000/cart?userId=${user.id}&id=${product.id}`)
      if (res.data.length > 0) {
        const item = res.data[0]
        await axios.patch(`http://localhost:3000/cart/${item.id}`, {
          quantity: item.quantity + 1
        })
      } else {
        await axios.post('http://localhost:3000/cart', {
          ...product,
          userId: user.id,
          quantity: 1
        })
      }
    },

    async removeFromCart({ commit }, id) {
      commit('REMOVE_FROM_CART', id)
      await axios.delete(`http://localhost:3000/cart/${id}`)
    },

    clearCart({ commit }) {
      commit('CLEAR_CART')
    },

    setCart({ commit }, cartItems) {
      commit('SET_CART', cartItems)
    }
  }
}
