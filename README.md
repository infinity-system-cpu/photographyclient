# Sistema de Citas - Cliente

Aplicación web para que los clientes puedan agendar citas con paquetes fotográficos sin necesidad de iniciar sesión.

## Características

- Selección de paquetes: NOCHE BUENA, UVA, BRINDIS.
- Formulario con nombre, teléfono, cantidad de personas, fecha y hora.
- Validación de horarios ocupados.
- Interfaz moderna y responsive.
- Al registrar, se muestra una ventana emergente de confirmación.

## Paquetes

| Paquete      | Descripción                                    | Precio |
|--------------|------------------------------------------------|--------|
| NOCHE BUENA  | 10 fotos digitales, 7 impresiones 13x18cm, 1 set | $1400  |
| UVA          | 15 fotos digitales, 10 impresiones 13x18cm, 1 impresión 20x25cm, 1 set | $1800 |
| BRINDIS      | 20 fotos digitales, 10 impresiones 13x18cm, 2 impresiones 20x25cm, 1 set | $2200 |

## Horarios Disponibles

- **Lunes a Viernes**: 6:30pm - 10:00pm (cada 30 min)
- **Sábado**: 3:00pm - 8:00pm (cada 30 min)
- **Domingo**: 9:00am - 8:00pm (cada 30 min)

## Instalación

1. Clona este repositorio o descarga los archivos.
2. Asegúrate de tener un proyecto de Firebase configurado.
3. Crea un archivo `firebase-config.js` con tus credenciales.
4. Abre `index.html` en un servidor local (por ejemplo, con `npx serve .`).
5. ¡Listo para usar!

## Requisitos

- Conexión a internet.
- Navegador moderno (Chrome, Firefox, Edge).

## Créditos

- Firebase
- HTML/CSS/JS