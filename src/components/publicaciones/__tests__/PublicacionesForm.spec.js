import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import PublicacionesForm from '../PublicacionesForm.vue'

// Definir mocks hoisted seguros para Vitest
const hoisted = vi.hoisted(() => ({
  createPublicacionMock: vi.fn(async () => ({ status: 'success', data: { id: 123 } })),
}))

vi.mock('vue-router', async (orig) => {
  const actual = await orig()
  return {
    ...actual,
    useRoute: () => ({ name: 'nuevo-publicaciones', params: {} }),
    useRouter: () => ({ push: vi.fn() }),
  }
})

vi.mock('@/composables/useTiposPublicacion', () => {
  const tiposPublicacion = ref([
    { id: 1, descripcion: 'Edicto' },
    { id: 2, descripcion: 'Comunicaciones' },
  ])
  return {
    useTiposPublicacion: () => ({ tiposPublicacion, getTiposPublicacion: vi.fn() }),
  }
})

vi.mock('@/composables/usePublicaciones', () => {
  const loading = ref(false)
  const apiError = ref('')
  return {
    usePublicaciones: () => ({
      loading,
      apiError,
      createPublicacion: hoisted.createPublicacionMock,
      updatePublicacion: vi.fn(async () => ({ status: 'success', data: { id: 99 } })),
      getPublicacionById: vi.fn(async () => ({ status: 'success', data: {
        id: 1,
        fecha: '2024-03-21',
        fechapublicacion: '2024-03-22',
        referencia: 'PUB-2024-001',
        archivo: 'documentos/x.pdf',
        tipopublicacion_id: 1,
        estado: 1,
      } })),
    }),
  }
})

describe('PublicacionesForm.vue', () => {
  it('renderiza el título de creación por defecto', () => {
    const wrapper = mount(PublicacionesForm, {
      global: { stubs: { RouterLink: true } },
    })
    expect(wrapper.text()).toContain('Crear Nueva Publicación')
  })

  it('valida campos requeridos y no envía si faltan', async () => {
    const wrapper = mount(PublicacionesForm, {
      global: { stubs: { RouterLink: true } },
    })
    await wrapper.find('form').trigger('submit.prevent')
    await nextTick()
    expect(wrapper.text()).toContain('La fecha de publicación es requerida')
    expect(wrapper.text()).toContain('La referencia es requerida')
    expect(wrapper.text()).toContain('El tipo de publicación es requerido')
  })

  it('envía exitosamente con archivo adjunto y muestra éxito', async () => {
    vi.useFakeTimers()

    const wrapper = mount(PublicacionesForm, {
      global: { stubs: { RouterLink: true } },
    })

    // Completar campos requeridos
    await wrapper.find('#fechapublicacion').setValue('2024-03-22')
    await wrapper.find('#referencia').setValue('Una referencia de prueba')
    await wrapper.find('#tipopublicacion_id').setValue('1')

    // Simular selección de archivo
    const file = new File(['contenido'], 'test.pdf', { type: 'application/pdf' })
    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [file] })
    await input.trigger('change')

    // Enviar formulario
    await wrapper.find('form').trigger('submit.prevent')
    await nextTick()

    // Se muestra notificación de éxito
    expect(wrapper.text()).toContain('Publicación creada correctamente')

    // createPublicacion se llamó
    expect(hoisted.createPublicacionMock).toHaveBeenCalled()

    // Avanzar timers para cerrar notificación (redirigir se prueba aparte si se desea)
    vi.advanceTimersByTime(3000)

    vi.useRealTimers()
  })
})
