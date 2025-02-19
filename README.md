# Chat Interactivo con IA

## Descripción

Esta aplicación es un chat interactivo que permite a los usuarios mantener conversaciones con una IA. Incluye una interfaz moderna y amigable con características como indicadores de escritura, avatares personalizados y almacenamiento de conversaciones.

## Características Principales

- 🔐 Modal de bienvenida con validación de datos
- 👤 Avatares personalizados basados en el nombre del usuario
- ⌨️ Indicador de "escribiendo..." durante las respuestas
- 💬 Diseño de burbujas de chat estilo WhatsApp
- 📱 Interfaz completamente responsiva
- 💾 Almacenamiento de conversaciones en Supabase
- ✨ Validaciones en tiempo real
- ⚡ Envío de mensajes con Enter

## Tecnologías Utilizadas

- **Next.js** (v14.0.0) - Framework de React
- **React** (v18.2.0) - Biblioteca de UI
- **TypeScript** (v5.0.0) - Lenguaje de programación
- **Tailwind CSS** (v3.3.0) - Framework de estilos
- **Supabase** (v2.39.0) - Base de datos en tiempo real
- **Shadcn/ui** (v1.0.0) - Componentes de UI
- **Radix UI** (v1.0.0) - Primitivos de UI accesibles

## Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Cuenta en Supabase

## Instalación

1. **Clonar el repositorio**

   git clone https://github.com/piperiver/chat-ia-me

2. **Instalar dependencias**

   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar variables de entorno**

   Crea un archivo `.env.local` en la raíz del proyecto:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
   ```

4. **Iniciar el servidor de desarrollo**

   ```bash
   npm run dev
   # o
   yarn dev
   ```

La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
src/
├── app/
│   └── page.tsx
├── components/
│   ├── Chat/
│   │   └── index.tsx
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       └── dialog.tsx
├── lib/
│   └── supabase.ts
└── assets/
    └── perfil.jpeg
```

## Despliegue

La aplicación está optimizada para ser desplegada en Vercel. Sigue estos pasos:

1. Sube tu código a GitHub
2. Conéctalo con Vercel
3. Configura las variables de entorno en Vercel
4. ¡Listo! Tu aplicación estará en línea

## Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría realizar.

## Licencia

MIT

## Autor

Felipe Rivera

## Agradecimientos

- Shadcn/ui por los componentes base
- Vercel por el hosting
- Supabase por la base de datos
