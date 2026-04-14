# React + Vite

## Base path del frontend

El proyecto ahora compila con `/` como base por defecto, para que funcione normal en `http://localhost:3002` o detrás de cualquier servidor estático sin un prefijo especial.

Si necesitas publicarlo detrás de un subpath, por ejemplo `/klinix/`, define la variable antes de compilar:

```bash
VITE_APP_BASE=/klinix/ npm run build
```

El router usa automáticamente la misma base que configure Vite, así que no hace falta tocar código adicional.
