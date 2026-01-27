import clienteAxios from "../config/axios";

export const obtenerUsuarios = async (page = 1, search = "") => {
  try {
    // Obtener el token de autenticación
    const token = localStorage.getItem("AUTH_TOKEN");

    // Realizar la solicitud a la API
    const { data } = await clienteAxios.get(
      `api/usuarios?page=${page}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Configurar el token en los headers
        },
      },
    );
    // Actualizar el estado con los usuarios obtenidos
    return data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error; // Lanza el error para manejarlo donde sea llamado
  }
};

export const obtenerRoles = async (page = 1, search = "") => {
  try {
    // Obtener el token de autenticación
    const token = localStorage.getItem("AUTH_TOKEN");

    // Realizar la solicitud a la API
    const { data } = await clienteAxios.get(
      `api/roles?page=${page}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Configurar el token en los headers
        },
      },
    );
    // Actualizar el estado con los roles obtenidos
    return data;
  } catch (error) {
    console.error("Error al obtener los roles:", error);
    throw error; // Lanza el error para manejarlo donde sea llamado
  }
};

export const obtenerDoctores = async (page = 1, search = "") => {
  try {
    // Obtener el token de autenticación
    const token = localStorage.getItem("AUTH_TOKEN");

    // Realizar la solicitud a la API
    const { data } = await clienteAxios.get(
      `api/doctores?page=${page}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Configurar el token en los headers
        },
      },
    );
    // Actualizar el estado con los doctores obtenidos
    return data;
  } catch (error) {
    console.error("Error al obtener los doctores:", error);
    throw error; // Lanza el error para manejarlo donde sea llamado
  }
};

export const obtenerConsultorios = async (page = 1, search = "") => {
  try {
    // Obtener el token de autenticación
    const token = localStorage.getItem("AUTH_TOKEN");

    // Realizar la solicitud a la API
    const { data } = await clienteAxios.get(
      `api/consultorios?page=${page}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Configurar el token en los headers
        },
      },
    );
    // Actualizar el estado con los consultorios obtenidos
    return data;
  } catch (error) {
    console.error("Error al obtener los consultorios:", error);
    throw error; // Lanza el error para manejarlo donde sea llamado
  }
};

export const obtenerPacientes = async (page = 1, search = "",tipoPersonaId) => {
  try {
    // Obtener el token de autenticación
    const token = localStorage.getItem("AUTH_TOKEN");

    // Realizar la solicitud a la API
    const tipoPersona = tipoPersonaId;
    const { data } = await clienteAxios.get(
      `api/Pacientes?page=${page}&search=${encodeURIComponent(search)}&id_type_people=${tipoPersona}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Configurar el token en los headers
        },
      },
    );
    // Actualizar el estado con los roles obtenidos
    return data;
  } catch (error) {
    console.error("Error al obtener los pacientes:", error);
    throw error; // Lanza el error para manejarlo donde sea llamado
  }
};
