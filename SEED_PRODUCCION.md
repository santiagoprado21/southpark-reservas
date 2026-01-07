# 🌱 Seed de Base de Datos en Producción

Como Render no permite acceso a shell en el plan gratuito, he creado un **endpoint temporal** para ejecutar el seed.

---

## 🚀 Cómo Ejecutar el Seed

### Paso 1: Subir los cambios

```bash
git add .
git commit -m "Add: Endpoint temporal para seed en producción"
git push origin main
```

### Paso 2: Esperar que Render redeploy

Espera que Render termine de hacer el build y deploy (2-3 minutos).

### Paso 3: Ejecutar el seed

Abre tu navegador y visita:

```
https://TU-BACKEND.onrender.com/api/seed?secret=southpark2024
```

**Reemplaza** `TU-BACKEND` con tu URL real de Render.

Ejemplo:
```
https://southpark-backend-abc123.onrender.com/api/seed?secret=southpark2024
```

---

## ✅ Si Todo Sale Bien

Verás una respuesta como esta:

```json
{
  "success": true,
  "message": "🌱 Seed ejecutado exitosamente",
  "data": {
    "admin": {
      "email": "admin@southpark.com",
      "password": "admin123"
    },
    "canchas": 6,
    "configuraciones": 6,
    "usuarios": 1
  }
}
```

**Esto significa que se crearon:**
- ✅ 4 canchas de Voley Playa
- ✅ 2 circuitos de Mini Golf
- ✅ 6 configuraciones (horarios, precios, etc.)
- ✅ 1 usuario admin
- ✅ 2 números de WhatsApp configurados

---

## 🔐 Credenciales del Admin

```
Email: admin@southpark.com
Contraseña: admin123
```

**⚠️ IMPORTANTE:** Después de hacer login, cambia la contraseña desde el panel de admin.

---

## ❌ Posibles Errores

### Error 1: "No autorizado"
```json
{
  "error": true,
  "message": "No autorizado. Proporciona el secret correcto."
}
```

**Solución:** Asegúrate de incluir `?secret=southpark2024` en la URL.

---

### Error 2: "La base de datos ya tiene datos"
```json
{
  "error": true,
  "message": "La base de datos ya tiene datos. Seed ya fue ejecutado.",
  "canchas": 6
}
```

**Solución:** ¡Perfecto! El seed ya fue ejecutado antes. No necesitas hacer nada.

---

### Error 3: 500 Internal Server Error

**Posibles causas:**
1. La base de datos no está conectada
2. Las variables de entorno no están configuradas en Render
3. Prisma no está generado correctamente

**Solución:**
1. Ve a Render Dashboard → tu servicio
2. Ve a "Environment" y verifica que `DATABASE_URL` esté configurada
3. Redeploy manualmente: "Manual Deploy" → "Clear build cache & deploy"

---

## 🧹 Después del Seed

### ⚠️ IMPORTANTE: Eliminar el Endpoint

Una vez que el seed se ejecute exitosamente, **debes eliminar este endpoint** por seguridad:

#### 1. Eliminar el archivo:
```bash
rm backend/src/routes/seed.routes.ts
```

#### 2. Remover la importación en `backend/src/index.ts`:

**Eliminar estas líneas:**
```typescript
import seedRoutes from './routes/seed.routes'; // TEMPORAL
app.use('/api/seed', seedRoutes); // TEMPORAL
```

#### 3. Subir cambios:
```bash
git add .
git commit -m "Remove: Endpoint temporal de seed"
git push origin main
```

---

## 🔒 Cambiar el Secret (Opcional pero Recomendado)

Si quieres un secret personalizado:

1. Agrega una variable de entorno en Render:
   - Nombre: `SEED_SECRET`
   - Valor: `TuSecretoPersonalizado123`

2. Usa ese secret en la URL:
   ```
   https://tu-backend.onrender.com/api/seed?secret=TuSecretoPersonalizado123
   ```

---

## 📋 Resumen

1. ✅ Push de cambios a GitHub
2. ✅ Esperar redeploy de Render
3. ✅ Visitar `/api/seed?secret=southpark2024`
4. ✅ Verificar respuesta exitosa
5. ✅ Hacer login con `admin@southpark.com` / `admin123`
6. ✅ Eliminar endpoint de seed
7. ✅ Push de limpieza

---

## 🎉 Verificar que Funcionó

Después del seed, visita tu frontend y:

1. Ve a la página de reservas
2. Deberías ver las opciones:
   - 4 canchas de Voley Playa
   - 2 circuitos de Mini Golf
3. Haz login en `/login` con las credenciales del admin
4. Ve al panel de admin

**¡Si todo funciona, el seed fue exitoso!** 🚀

---

¿Tienes dudas? Cualquier error que te salga, compártelo y lo resolvemos.

