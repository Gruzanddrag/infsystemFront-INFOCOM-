// https://vuex.vuejs.org/en/mutations.html

export default {
  setEditorText (state, playload) {
    state.editorText = playload
  },
  SET_SNACKBAR (state, playload) {
    state.snackbar = playload
  },
  SET_POPUP (state, playload) {
    state.exception = Object.assign(state.exception, playload)
  },
  THROW_POPUP (state, playload) {
    state.snackbar = true
    state.popup = Object.assign(state.popup, playload)
  },
  SET_LOADING (state, playload) {
    state.loading = true
  },
  UNSET_LOADING (state, playload) {
    state.loading = false
  },
  SET_USER (state, playload) {
    state.user = Object.assign(state.user, playload)
  },
  SET_AUTHENTICATED_STATUS (state, playload) {
    state.unauthenticated = playload
  },
  SET_REFRESHING_STATE (state, playload) {
    state.refreshingState = playload
  },
  SET_BLACKLISTED (state, playload) {
    state.blacklisted = playload
  },
  SET_URLS (state, playload) {
    state.urls = playload
  },
}
