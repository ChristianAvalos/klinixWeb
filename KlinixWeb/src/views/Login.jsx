import { createRef,useState } from "react"
import { Link,useNavigate } from "react-router-dom"
import Alerta from "../components/Alerta";
import { useAuth } from "../hooks/useAuth";
import Spinner from "../components/Spinner";

export default function Login() {

    const emailRef = createRef();
    const passwordRef = createRef();

    const [errores,setErrores] = useState([]);
    const [cargando, setCargando] = useState(false);

    const navigate = useNavigate();

    // Definir el middleware inicial como 'guest'
    const [middleware, setMiddleware] = useState('guest');
    const [url, setUrl] = useState('/');

    // Utilizar useAuth con el middleware y la URL dinámicos
    const { login, user } = useAuth({
        middleware,
        url
    });


    const handleSubmit = async e => {
        e.preventDefault();

        const datos = {
            email: emailRef.current.value,
            password: passwordRef.current.value, 

        }
        setCargando(true);
        //login(datos,setErrores,setCargando)
        try {
            // Espera a que la función login termine de ejecutarse
            await login(datos, setErrores, setCargando);
        } catch (error) {
        
            console.error("Error al iniciar sesión:", error);
        } 
    }

            // // Después de iniciar sesión, verificamos el rol del usuario y actualizamos el middleware
            // if (user) {
            //     if (user.rol_id === "1") {
            //         // Si el usuario es admin, actualizamos el middleware a 'admin'
            //         setMiddleware('admin');
            //         setUrl('/'); // Redirigir a la página de administrador
            //         navigate('/'); // Redirigir a la página de administrador
            //     } 
            // }
    
return (
    <>
        <h1 className="text-4xl font-black">Iniciar sesion</h1>
        <p>Para poder realizar eventos debes iniciar sesion</p>

        <div className="bg-white shadow-md rounded-md mt-10 px-5 py-10">
            <form 
                    onSubmit={handleSubmit}
                    noValidate
            >

            {errores ? errores.map((error,i) => <Alerta key={i}>{error}</Alerta>) : null}

                <div className="mb-4">
                    <label className="text-slate-800" htmlFor="email">
                        Email:
                    </label>
                    <input type="email"
                            id="email"
                            className="mt-2 w-full p-3 bg-gray-50"
                            name="email"
                            placeholder="Tu correo"
                            ref={emailRef}
                            />
                </div>
                <div className="mb-4">
                    <label className="text-slate-800" htmlFor="password">
                        Contraseña:
                    </label>
                    <input type="password"
                            id="name"
                            className="mt-2 w-full p-3 bg-gray-50"
                            name="password"
                            placeholder="Tu contraseña"
                            ref={passwordRef}
                            />
                </div>

                <input type="submit" value="Iniciar sesion"
                        className="bg-indigo-600 hover:bg-indigo-800 text-white w-full mt-5 p3 uppercase cursor-pointer"
                        // disabled={cargando}
                />
                {cargando && errores.length === 0 && <Spinner />}
            </form>
            
        </div>
        <nav className="mt-5">
            <Link to="/auth/registro">
                ¿No tienes cuenta? Crea una
            </Link>
        </nav>
        </>
    )
}
