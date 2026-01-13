import useSWR from "swr";
import { useNavigate } from "react-router-dom";
import clienteAxios from '../config/axios.js'
import { useEffect } from "react";



export const useAuth = ({middleware,url}) =>{

    const token = localStorage.getItem('AUTH_TOKEN');
    const navigate = useNavigate();

    const {data: user, error,mutate}= useSWR('/api/user',()=>
        clienteAxios('/api/user',{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.data)
        .catch(error => {
            throw Error (error?.response?.data?.errors)
        })
    )

    const login = async (datos,setErrores) =>{
        try {
            const {data} = await clienteAxios.post('/api/login',datos)
            localStorage.setItem('AUTH_TOKEN',data.token);
            setErrores([]);
            await mutate();
        } catch (error) {
            setErrores(Object.values(error.response.data.errors));
            await mutate(null);
        }

    }

    const registro = async (datos,setErrores)=>{
        try {
            const {data} = await clienteAxios.post('/api/registro',datos)
            localStorage.setItem('AUTH_TOKEN',data.token)
            setErrores([])
            await mutate()
        } catch (error) {
            setErrores(Object.values(error.response.data.errors));
        }
    }

    const logout = async ()=>{
        try {
            await clienteAxios.post('/api/logout',null,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            localStorage.removeItem('AUTH_TOKEN')
            await mutate(undefined)
        } catch (error) {
            throw Error (error?.response?.data?.errors)
        }
    }


    useEffect(() => {
        // if (middleware === 'guest' && url && user){
        //     navigate(url);
        // }

        //Si su estado es inactivo va a error por mas que sea administrador no podra hacer nada
        if (user && user.id_tipoestado !== "1"){
            navigate('/errorEstadoUsuario');
            return;
        }
        

        //Si es administrador inicia en el panel de administrador
        if (user && user.rol_id === "1"){
            navigate('/');
            return;
        }

        //Si es un usuario y su rol es diferente de su rol administrador ingresa a la vista general 
        if (middleware === 'guest' && user && user.rol_id !== "1"){
            navigate('/iniciousuarios');
            return;
        }

        //Si es un usuario y no tiene definido su rol le va a aparecer en la pagina de error 
        if (middleware === 'guest' && user && (user.rol_id === undefined || user.rol_id === null) ){
            navigate('/error');
            return;
        }

        //Si la autenticacion es erronea retorna al login con los errores 
        if(middleware === 'auth' && error ){
            navigate('/auth/login');
        }
    },[user,error]
    )

    return {
        login,
        registro,
        logout,
        user,
        error
    }

}