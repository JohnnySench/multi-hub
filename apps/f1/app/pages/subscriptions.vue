<script setup lang="ts">
  definePageMeta({
    title: 'Подписки',
  })

  const { subscribe, unsubscribe } = usePushNotification()
  const { add } = useToast()

  async function testPush() {
    try {
      const s = await (await navigator.serviceWorker.ready).pushManager.getSubscription()
      await $fetch('/api/push/test', { method: 'POST', body: { endpoint: s?.endpoint } })
    }
    catch (error) {
      console.error(error)
      add({
        ...toastForError(error, {
          [ApiErrorCode.InvalidBody]: { title: 'Браузер не подписан', description: 'Сначала нажмите Subscribe', color: 'warning' },
          [ApiErrorCode.DeviceNotFound]: { title: 'Устройства нет в базе', description: 'Подпишитесь ещё раз', color: 'warning' },
          [ApiErrorCode.PushServiceFailed]: { title: 'Push-сервис не принял уведомление', description: 'Подробности — в консоли', color: 'error' },
        }),
        duration: 3000,
      })
    }
  }
</script>

<template>
  <div>
    <UButton label="Subscribe" @click="subscribe" />
    <UButton label="Unsubscribe" @click="unsubscribe" />
    <DevOnly>
      <UButton label="Test push" @click="testPush" />
    </DevOnly>
  </div>
</template>

<style scoped>

</style>
