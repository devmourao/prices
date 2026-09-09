import { registerSW } from 'virtual:pwa-register'

registerSW({
  immediate: true,
  onNeedRefresh() {
    // Sprint Zero scaffold: log only.
    // CB-21 adds the user-facing "update available" flow.
    console.info('[pwa] new content available, will activate on next load')
  },
  onOfflineReady() {
    console.info('[pwa] app ready for offline use')
  },
})
