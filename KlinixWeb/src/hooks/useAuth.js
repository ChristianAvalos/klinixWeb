import useSWR from "swr";
import { useNavigate } from "react-router-dom";
import clienteAxios from '../config/axios.js'
import { useEffect } from "react";



export const useAuth = ({middleware,url}) =>{

    const token = localStorage.getItem('AUTH_TOKEN');
    const navigate = useNavigate();

    const { data: user, error, mutate } = useSWR('/api/user', () => {
    const token = localStorage.getItem('AUTH_TOKEN');
        return clienteAxios('/api/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.data)
        .catch(error => {
            throw Error(error?.response?.data?.errors)
        });
    });

    const login = async (datos,setErrores) =>{
        try {
            const {data} = await clienteAxios.post('/api/login',datos)
            localStorage.setItem('AUTH_TOKEN',data.token);
            setErrores([]);
            mutate(data.user, false);
        } catch (error) {
            setErrores(Object.values(error.response.data.errors));
            mutate(null,false);
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
        
        if (middleware === 'guest' && url && user){
            navigate(url);
        }

        //Si su estado es inactivo va a error por mas que sea administrador no podra hacer nada
        if (user && Number(user.id_tipoestado) !== 1){
            console.log('user',user)
            navigate('/errorEstadoUsuario');
            return;
        }

        //Si es un usuario y no tiene definido su rol le va a aparecer en la pagina de error 
        if (middleware === 'guest' && user && (Number(user.rol_id) === undefined || Number(user.rol_id)  === null) ){
            navigate('/error');
            return;
        }
        
        //  //Si no tiene definido su organizacion le va a aparecer en la pagina de error
        if (middleware === 'guest' && user && (Number(user.id_organizacion) === undefined || Number(user.id_organizacion) === null) ){
            navigate('/error');
            return;
        }

        //Si es un usuario y su rol es diferente de su rol administrador ingresa a la vista general 
        if (middleware === 'guest' && user && Number(user.rol_id) !== 1){
            navigate('/iniciousuarios');
            return;
        }

        //Para este caso no importa que sea administrador o no, si es un usuario inactivo lo redirige a error
        if (user && middleware === 'guest'){
            navigate('/');
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