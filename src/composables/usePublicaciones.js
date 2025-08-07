import { ref, computed } from 'vue';
import { useAuth } from './useAuth';

export const usePublicaciones = () => {
  const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
  const { token } = useAuth();

  const publicaciones = ref([]);
  const apiError = ref('');
  const loading = ref(false);
  const loadingBackground = ref(false);

  // Paginación local
  const paginacion = ref({
    pagina: 1,
    porPagina: 10,
    total: 0
  });

  // Filtros locales
  const filtros = ref({
    busqueda: '',
    tipo: '',
    estado: ''
  });

  // Computed property para publicaciones filtradas
  const publicacionesFiltradas = computed(() => {
    let resultado = publicaciones.value;

    // Aplicar filtro de búsqueda
    if (filtros.value.busqueda) {
      const busqueda = filtros.value.busqueda.toLowerCase();
      resultado = resultado.filter(pub => 
        pub.referencia.toLowerCase().includes(busqueda)
      );
    }

    // Aplicar filtro de tipo
    if (filtros.value.tipo) {
      resultado = resultado.filter(pub => 
        pub.tipopublicacion_id === parseInt(filtros.value.tipo)
      );
    }

    // Aplicar filtro de estado
    if (filtros.value.estado) {
      resultado = resultado.filter(pub => 
        pub.estado === parseInt(filtros.value.estado)
      );
    }

    return resultado;
  });

  // Computed property para la paginación local
  const publicacionesPaginadas = computed(() => {
    const inicio = (paginacion.value.pagina - 1) * paginacion.value.porPagina;
    const fin = inicio + paginacion.value.porPagina;
    return publicacionesFiltradas.value.slice(inicio, fin);
  });

  const totalPaginas = computed(() => {
    return Math.ceil(publicacionesFiltradas.value.length / paginacion.value.porPagina);
  });

  const getPublicacionesIniciales = async () => {
    apiError.value = null;
    loading.value = true;

    try {
      const response = await fetch(`${BASE_API_URL}/publicaciones?limit=10`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error HTTP: ${response.status}`);
      }

      if (data.status === 'error') {
        throw new Error(data.message);
      }

      // Almacenar los datos iniciales
      publicaciones.value = data.data || [];
      
      // Cargar el resto en background
      cargarPublicacionesBackground();

      return {
        status: 'success',
        data: publicaciones.value
      };
    } catch (error) {
      console.error('Error en getPublicacionesIniciales:', error);
      apiError.value = error.message;
      return {
        status: 'error',
        message: error.message
      };
    } finally {
      loading.value = false;
    }
  };

  const cargarPublicacionesBackground = async () => {
    if (loadingBackground.value) return;
    
    loadingBackground.value = true;
    const añoActual = new Date().getFullYear();

    try {
      const response = await fetch(`${BASE_API_URL}/publicaciones?year=${añoActual}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error HTTP: ${response.status}`);
      }

      if (data.status === 'error') {
        throw new Error(data.message);
      }

      // Combinar con las publicaciones existentes, evitando duplicados
      const nuevasPublicaciones = data.data || [];
      const idsExistentes = new Set(publicaciones.value.map(p => p.id));
      
      const publicacionesUnicas = nuevasPublicaciones.filter(p => !idsExistentes.has(p.id));
      publicaciones.value = [...publicaciones.value, ...publicacionesUnicas];

    } catch (error) {
      console.error('Error en cargarPublicacionesBackground:', error);
    } finally {
      loadingBackground.value = false;
    }
  };

  const getPublicacionById = async (id) => {
    apiError.value = null;
    loading.value = true;

    try {
      const response = await fetch(`${BASE_API_URL}/publicaciones/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error HTTP: ${response.status}`);
      }

      if (data.status === 'error') {
        throw new Error(data.message);
      }

      return {
        status: 'success',
        data: data.data
      };
    } catch (error) {
      console.error('Error en getPublicacionById:', error);
      apiError.value = error.message;
      return {
        status: 'error',
        message: error.message
      };
    } finally {
      loading.value = false;
    }
  };

  const createPublicacion = async (publicacionData) => {
    apiError.value = null;
    loading.value = true;

    try {
      // Crear FormData para el archivo
      const formData = new FormData();
      
      formData.append('fecha', publicacionData.fecha);
      formData.append('fechapublicacion', publicacionData.fechapublicacion);
      formData.append('referencia', publicacionData.referencia);
      formData.append('estado', publicacionData.estado ?? 1);
      formData.append('tipopublicacion_id', publicacionData.tipopublicacion_id);
      formData.append('publicacionFile', publicacionData.archivo);

      const response = await fetch(`${BASE_API_URL}/publicaciones`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error HTTP: ${response.status}`);
      }

      if (data.status === 'error') {
        throw new Error(data.message);
      }

      return {
        status: 'success',
        data: data.data
      };
    } catch (error) {
      console.error('Error en createPublicacion:', error);
      apiError.value = error.message;
      return {
        status: 'error',
        message: error.message
      };
    } finally {
      loading.value = false;
    }
  };

  const updatePublicacion = async (id, publicacionData) => {
    apiError.value = null;
    loading.value = true;

    try {
      // Crear FormData para el archivo
      const formData = new FormData();
      
      formData.append('fecha', publicacionData.fecha);
      formData.append('fechapublicacion', publicacionData.fechapublicacion);
      formData.append('referencia', publicacionData.referencia);
      formData.append('estado', publicacionData.estado ?? 1);
      formData.append('tipopublicacion_id', publicacionData.tipopublicacion_id);
      formData.append('_method', 'PUT');
      
      if (publicacionData.archivo) {
        formData.append('publicacionFile', publicacionData.archivo);
      }

      const response = await fetch(`${BASE_API_URL}/publicaciones/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error HTTP: ${response.status}`);
      }

      if (data.status === 'error') {
        throw new Error(data.message);
      }

      return {
        status: 'success',
        data: data.data
      };
    } catch (error) {
      console.error('Error en updatePublicacion:', error);
      apiError.value = error.message;
      return {
        status: 'error',
        message: error.message
      };
    } finally {
      loading.value = false;
    }
  };

  const deletePublicacion = async (id) => {
    apiError.value = null;
    loading.value = true;

    try {
      const response = await fetch(`${BASE_API_URL}/publicaciones/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error HTTP: ${response.status}`);
      }

      if (data.status === 'error') {
        throw new Error(data.message);
      }

      return {
        status: 'success',
        data: true
      };
    } catch (error) {
      console.error('Error en deletePublicacion:', error);
      apiError.value = error.message;
      return {
        status: 'error',
        message: error.message
      };
    } finally {
      loading.value = false;
    }
  };

  // Función para actualizar filtros
  const actualizarFiltros = (nuevosFiltros) => {
    filtros.value = {
      ...filtros.value,
      ...nuevosFiltros
    };
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    filtros.value = {
      busqueda: '',
      tipo: '',
      estado: ''
    };
  };

  const cambiarPagina = (nuevaPagina) => {
    paginacion.value.pagina = nuevaPagina;
  };

  return {
    publicaciones: publicacionesPaginadas,
    publicacionesFiltradas,
    filtros,
    apiError,
    loading,
    loadingBackground,
    paginacion,
    totalPaginas,
    getPublicacionesIniciales,
    getPublicacionById,
    createPublicacion,
    updatePublicacion,
    deletePublicacion,
    actualizarFiltros,
    limpiarFiltros,
    cambiarPagina,
  };
}; 