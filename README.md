# Agenda Firestore

Esta carpeta contiene una página web simple de agenda que sincroniza nombres con Firestore en tiempo real.

## Archivos añadidos

- `proyectos/agenda.html` — interfaz de la agenda.
- `javascript/agenda.js` — script que conecta con Firebase Firestore.
- `CSS/agenda.css` — estilos de la agenda.

## Cómo usarla

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2. Añade una aplicación web y copia la configuración de Firebase.
3. Reemplaza los valores de `firebaseConfig` en `javascript/agenda.js`.
4. Habilita Firestore en el proyecto y usa la colección `agenda`.

## Configuración

En `javascript/agenda.js` reemplaza:

```js
const firebaseConfig = {
  apiKey: "REEMPLAZA",
  authDomain: "REEMPLAZA",
  projectId: "REEMPLAZA",
  storageBucket: "REEMPLAZA",
  messagingSenderId: "REEMPLAZA",
  appId: "REEMPLAZA"
};
```

con la configuración de tu proyecto Firebase.

## Abrir la página

Debido a que el script usa módulos ES y carga Firebase desde CDN, abre el HTML con un servidor local.

Ejemplo con Python:

```bash
cd /workspaces/TEMA1
python3 -m http.server 8000
```

Luego abre en el navegador:

`http://localhost:8000/proyectos/agenda.html`

## Qué hace

- Agrega nombres a Firestore.
- Muestra la lista en tiempo real.
- Permite eliminar entradas.

## Nota

Si abres directamente el archivo con `file://`, el módulo puede no cargarse. Usa un servidor local.
