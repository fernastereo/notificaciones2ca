import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import PublicacionesList from '../PublicacionesList.vue'

vi.mock('@/composables/usePublicaciones', () => {
  const publicaciones = ref([
    {
      id: 1,
      referencia: 'PUB-2024-001',
      fecha: '2024-03-21',
      fechapublicacion: '2024-03-22',
      estado: 1,
      tipopublicacion_id: 1,
      archivo: 'documentos/archivo.pdf',
    },
  ])
  const publicacionesFiltradas = ref(publicaciones.value)
  const filtros = ref({ busqueda: '', tipo: '', estado: '' })
  const loading = ref(false)
  const apiError = ref('')
  const loadingBackground = ref(false)
  const paginacion = ref({ pagina: 1, porPagina: 10 })
  const totalPaginas = ref(1)

  return {
    usePublicaciones: () => ({
      publicaciones,
      publicacionesFiltradas,
      filtros,
      loading,
      apiError,
      loadingBackground,
      paginacion,
      totalPaginas,
      getPublicacionesIniciales: vi.fn(),
      deletePublicacion: vi.fn(),
      actualizarFiltros: vi.fn(),
      limpiarFiltros: vi.fn(),
      cambiarPagina: vi.fn((n) => (paginacion.value.pagina = n)),
      cambiarPorPagina: vi.fn((n) => (paginacion.value.porPagina = Number(n))),
    }),
  }
})

vi.mock('@/composables/useTiposPublicacion', () => {
  const tiposPublicacion = ref([
    { id: 1, descripcion: 'Edicto' },
    { id: 2, descripcion: 'Comunicaciones' },
  ])
  const loading = ref(false)
  return {
    useTiposPublicacion: () => ({ tiposPublicacion, loading, getTiposPublicacion: vi.fn() }),
  }
})

vi.mock('vue-router', async (orig) => {
  const actual = await orig()
  return {
    ...actual,
    useRouter: () => ({ push: vi.fn() }),
  }
})

describe('PublicacionesList.vue', () => {
  it('renderiza el encabezado y el botón Nueva Publicación', () => {
    const wrapper = mount(PublicacionesList)
    expect(wrapper.text()).toContain('Gestión de Publicaciones')
    expect(wrapper.text()).toContain('Nueva Publicación')
  })

  it('muestra una fila con la publicación mockeada', async () => {
    const wrapper = mount(PublicacionesList)
    const filas = wrapper.findAll('tbody tr')
    expect(filas.length).toBeGreaterThan(0)
    expect(wrapper.text()).toContain('PUB-2024-001')
  })

  it('formatea las fechas en formato DD-MM-YYYY', async () => {
    const wrapper = mount(PublicacionesList)
    expect(wrapper.text()).toContain('21-03-2024')
    expect(wrapper.text()).toContain('22-03-2024')
  })
})
