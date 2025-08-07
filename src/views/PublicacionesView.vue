<template>
  <RouterView v-slot="{ Component }">
    <transition
      name="fade"
      mode="out-in"
      @before-leave="beforeLeave"
      @enter="enter"
      @after-enter="afterEnter"
    >
      <component :is="Component" />
    </transition>
  </RouterView>
</template>

<script setup>
const beforeLeave = (el) => {
  el.style.height = el.offsetHeight + 'px'
  el.style.overflow = 'hidden'
}

const enter = (el) => {
  el.style.height = 'auto'
  const height = el.offsetHeight + 'px'
  el.style.height = '0'
  
  // Forzar un reflow
  el.offsetHeight
  
  el.style.height = height
}

const afterEnter = (el) => {
  el.style.height = 'auto'
  el.style.overflow = ''
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease, height 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>