
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
    addToCart({ commit }, product) {
      commit('ADD_TO_CART', product)
    },
    removeFromCart({ commit }, id) {
      commit('REMOVE_FROM_CART', id)
    },
    clearCart({ commit }) {
      commit('CLEAR_CART')
    }
  }
}
