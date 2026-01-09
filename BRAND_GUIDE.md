# 🎨 Guía de Marca - South Park

## Paleta de Colores Institucional

Basada en el logo oficial de South Park, hemos definido la siguiente paleta de colores:

### Colores Principales

```css
/* Azul South Park - Color principal del texto del logo */
--sp-blue: hsl(211, 70%, 39%)
Color: #1e5ba8
Uso: Marca principal, headers, botones primarios

/* Amarillo South Park - Del balón de voleibol */
--sp-yellow: hsl(45, 99%, 60%)
Color: #FCD535
Uso: CTAs principales, badges de acción, elementos destacados

/* Rojo South Park - Detalles del balón */
--sp-red: hsl(355, 75%, 58%)
Color: #E63946
Uso: Estados destructivos, alertas, cancelaciones

/* Verde South Park - Del pasto/campo */
--sp-green: hsl(120, 35%, 38%)
Color: #4A7C3E
Uso: Estados de éxito, confirmaciones, badges positivos
```

### Aplicación de Colores

- **Primario (primary)**: Azul South Park - Para navegación, links, elementos principales
- **Secundario (secondary)**: Amarillo South Park - Para CTAs y acciones importantes
- **Acento (accent)**: Verde South Park - Para estados positivos
- **Destructivo (destructive)**: Rojo South Park - Para acciones peligrosas

## Tipografía

### Fuentes Principales

```
Títulos y Headings: 'Poppins' (600-900 weight)
- Uso: h1, h2, h3, h4, h5, h6, botones

Cuerpo de texto: 'Inter' (300-700 weight)
- Uso: párrafos, labels, textos generales
```

### Aplicación

```css
/* Headings */
font-family: 'Poppins', sans-serif;
font-weight: 700;

/* Body text */
font-family: 'Inter', sans-serif;
font-weight: 400;

/* Buttons */
font-family: 'Poppins', sans-serif;
font-weight: 600;
```

### Clases Tailwind

```jsx
// Títulos
<h1 className="font-display font-bold">...</h1>
<h2 className="font-poppins font-semibold">...</h2>

// Texto normal
<p className="font-inter">...</p>

// Botones
<Button className="font-poppins font-semibold">...</Button>
```

## Logo

### Ubicación
`/public/logoSouthPark.png`

### Componente Logo

```tsx
import Logo from "@/components/Logo";

// Tamaños disponibles: "sm" | "md" | "lg" | "xl"
<Logo size="md" />

// Con/sin texto
<Logo size="md" showText={true} />
<Logo size="sm" showText={false} />

// Color del texto personalizado
<Logo size="md" textColor="text-white" />
```

### Casos de Uso

- **Navbar**: Logo pequeño (sm) con texto
- **Footer**: Logo mediano (md) con texto blanco
- **Login**: Logo grande (lg) con texto
- **Admin Sidebar**: Logo pequeño (sm) sin texto + texto separado

## Componentes Actualizados

### ✅ Navbar
- Logo institucional
- Botón "Reservar Ahora" con amarillo South Park
- Hover effects con colores de marca

### ✅ Hero
- Gradiente de colores institucionales en título
- Botones con colores de marca
- Floating badges con amarillo y verde

### ✅ Footer
- Fondo azul South Park
- Logo blanco
- Enlaces y texto en blanco

### ✅ Admin Layout
- Sidebar azul South Park
- Logo en header
- Navegación con hover effects institucionales

### ✅ Login
- Logo grande centrado
- Gradiente de fondo con colores institucionales
- Botón de login azul South Park

### ✅ 404 Page
- Logo institucional
- Icono de alerta con rojo South Park
- Diseño coherente con marca

## Gradientes Recomendados

```css
/* Hero / Headers */
background: linear-gradient(135deg, 
  hsl(211, 70%, 39%) 0%,    /* Azul */
  hsl(120, 35%, 38%) 50%,    /* Verde */
  hsl(45, 99%, 60%) 100%     /* Amarillo */
);

/* Backgrounds sutiles */
background: linear-gradient(to bottom right,
  hsl(211, 70%, 39%, 0.1),
  hsl(0, 0%, 100%),
  hsl(45, 99%, 60%, 0.1)
);
```

## Estados y Badges

```tsx
// Confirmada - Verde
<Badge className="bg-sp-green">Confirmada</Badge>

// Pendiente - Amarillo
<Badge className="bg-sp-yellow text-secondary-foreground">Pendiente</Badge>

// Cancelada - Rojo
<Badge className="bg-sp-red">Cancelada</Badge>
```

## Botones

### Primario (Acciones principales)
```tsx
<Button className="bg-sp-yellow hover:bg-sp-yellow/90 font-poppins font-semibold">
  Reservar Ahora
</Button>
```

### Secundario (Admin / Login)
```tsx
<Button className="bg-sp-blue hover:bg-sp-blue/90">
  Iniciar Sesión
</Button>
```

### Outline
```tsx
<Button 
  variant="outline" 
  className="border-sp-blue hover:bg-sp-blue hover:text-white"
>
  Ver más
</Button>
```

## Animaciones

Todas las animaciones existentes se mantienen:
- `animate-fade-in`
- `animate-slide-up`
- `animate-float`

## Próximos Pasos

- [ ] Aplicar colores institucionales a componentes admin (Dashboard, Reportes, etc.)
- [ ] Actualizar ilustraciones y gráficos con paleta de marca
- [ ] Crear assets adicionales (banners, social media, etc.)
- [ ] Documentar patrones de diseño específicos

---

**Fecha de actualización**: ${new Date().toLocaleDateString('es-AR')}
**Versión**: 1.0

