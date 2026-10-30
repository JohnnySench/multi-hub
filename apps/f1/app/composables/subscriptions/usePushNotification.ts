export function usePushNotification() {
  const config = useRuntimeConfig()

  const { add } = useToast()

  async function subscribe() {
    const isAllowPush = canAllowPushTechnically()
    if (!isAllowPush) {
      add({
        title: 'Старая мобила у тебя',
        description: 'Обнови систему телефона или купи новый бро))',
        duration: 3000,
      })
      return
    }
    const permission = await Notification.requestPermission()

    if (permission !== 'granted') {
      add({
        title: 'Че то отменил',
        description: 'Не будет у тебя уведомлений, надо ВКЛЮЧИТЬ ИХ',
        duration: 3000,
      })
      return
    }

    try {
      const registration = await navigator.serviceWorker.ready

      const subscription = await registration.pushManager.getSubscription()
        ?? await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(config.public.vapidKey),
        })

      await $fetch('/api/push/subscribe', {
        method: 'POST',
        body: subscription.toJSON(),
      })
    }
    catch (error) {
      console.error(error)
      add({
        ...toastForError(error, {
          [ApiErrorCode.InvalidBody]: {
            title: 'Браузер отдал неполную подписку',
            description: 'Отключите и снова включите уведомления',
            color: 'error',
          },
        }),
        duration: 3000,
      })
    }
  }

  async function unsubscribe() {
    try {
      const isAllowPush = canAllowPushTechnically()
      if (!isAllowPush) {
        add({
          title: 'Старая мобила у тебя',
          description: 'Обнови систему телефона или купи новый бро))',
          duration: 3000,
        })
        return
      }
      const registration = await navigator.serviceWorker.ready

      const subscription = await registration.pushManager.getSubscription()
      if (!subscription) {
        return
      }
      const isUnsub = await subscription.unsubscribe()
      if (isUnsub) {
        await $fetch('/api/push/unsubscribe', {
          method: 'POST',
          body: subscription.toJSON(),
        })
      }
    }
    catch (error) {
      console.error(error)
      add({ ...toastForError(error), duration: 3000 })
    }
  }
  return {
    subscribe,
    unsubscribe,
  }
}
