# 📱 Guía para configurar WhatsApp en tu Gestor de Citas

**Tiempo: 5 minutos · Gratis**

> ⚠️ **Importante:** NO necesitas tener WhatsApp Business. Funciona con tu WhatsApp normal.
> Solo necesitas poder recibir un SMS o llamada para verificar tu número.
> Si YA tienes WhatsApp normal instalado, puedes seguir usándolo.

---

## Paso 1: Entra a Facebook Developers

1. Abre: **https://developers.facebook.com/**
2. Inicia sesión con tu cuenta de **Facebook personal** (la que uses normalmente)
3. Arriba a la derecha, haz clic en **"My Apps"** → **"Create App"**

---

## Paso 2: Crea una App Business

1. Selecciona **"Business"** como tipo de app
2. Dale un nombre: **"Gestor de Citas [TuNegocio]"**
3. Pon tu email y haz clic en **"Create App"**

---

## Paso 3: Añade el producto WhatsApp

1. En el panel de la app, busca **"WhatsApp"**
2. Haz clic en **"Set Up"**
3. Espera unos segundos a que se configure

---

## Paso 4: Configura tu número

> 📱 **Tu WhatsApp normal sirve.** No necesitas instalar WhatsApp Business.
> El sistema te pedirá verificar el número con un código por SMS o llamada.
> Después puedes SEGUIR usando WhatsApp normal. La API funciona aparte.

1. En la sección **"API Setup"**, busca "Phone number ID"
2. Abajo verás **"Send and receive messages"**
3. **Añade tu número de teléfono** (el que usas para WhatsApp)
   - Formato internacional sin + : ejemplo **573001234567**
4. Recibirás un código por SMS o llamada
5. **Verifica el número**

---

## Paso 5: Copia el Token

1. En la misma página, busca **"Permanent Access Token"**
2. Haz clic en **"Generate Token"**
3. **Copia el token completo** (empieza con EAAT...)
4. TAMBIÉN copia el **"Phone number ID"** (es un número)

---

## Paso 6: Pega los datos en el panel

1. Ve a tu panel de **Club Contable**
2. Menú → **Config. Citas**
3. Activa **WhatsApp**
4. Pega:
   - **Token**: el token que copiaste
   - **Teléfono**: tu número (ej: 573001234567)

---

## ✅ ¡Listo! Ahora tus clientes reciben WhatsApp automáticos

Cuando alguien pida cita:

- **Confirmación:** "Hola [cliente], te confirmamos tu cita en [negocio] para el [fecha] a las [hora]"
- **Recordatorio:** "📅 Recordatorio: mañana tienes cita en [negocio] a las [hora]"

---

### ❓ ¿Problemas?

- Asegúrate de que el número está en formato internacional: código de país + número (ej: 573001234567)
- El token no tiene fecha de expiración si generas el **Permanent Token**
- Si tienes WhatsApp normal, NO lo pierdes. Puedes usar los dos.
- Si no te llega el SMS, prueba con llamada telefónica

### 📩 ¿Necesitas ayuda?

Escríbenos y te guiamos paso a paso.
