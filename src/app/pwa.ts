import { registerSW } from 'virtual:pwa-register'
import { PWA_UPDATE_EVENT } from '../components/ui/UpdatePrompt'

registerSW({
  immediate: true,
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent(PWA_UPDATE_EVENT))
  },
  onOfflineReady() {
    console.info('[pwa] app ready for offline use')
  },
})
