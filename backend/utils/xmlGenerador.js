const Producto = require('../models/Producto');
const { js2xml } = require('xml-js');


/**
 * Obtener datos del informe en formato JSON para gráficos
 * @route GET /api/productos/informe/datos
 */
exports.obtenerDatosInforme = async (req, res) => {
  try {
    const Producto = require('../models/Producto');
    const productos = await Producto.find().sort({ categoria: 1, nombre: 1 });
    
    if (productos.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'No hay productos para generar el informe'
      });
    }
    
    const cantidadTotal = productos.reduce((sum, p) => sum + p.cantidad, 0);
    const valorTotal = productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    
    const datosGrafico = productos.map(p => {
      const valorProducto = p.precio * p.cantidad;
      const porcentajeValor = valorTotal > 0 
        ? ((valorProducto / valorTotal) * 100).toFixed(2)
        : 0;
      
      return {
        nombre: p.nombre,
        precio: parseFloat(p.precio).toFixed(2),
        valorTotal: valorProducto.toFixed(2),
        porcentajeValor: parseFloat(porcentajeValor),
        cantidad: p.cantidad,
        categoria: p.categoria
      };
    });

    // Construir estructura del árbol XML como objeto
    const arbolXML = {
      informe: {
        _attributes: {
          fecha: new Date().toISOString(),
          tipo: 'Inventario de Productos'
        },
        resumen: {
          totalProductos: productos.length,
          cantidadTotal: cantidadTotal,
          valorTotal: parseFloat(valorTotal.toFixed(2))
        },
        productos: {
          producto: productos.map(p => {
            const valorProducto = p.precio * p.cantidad;
            const porcentajeValor = valorTotal > 0 
              ? ((valorProducto / valorTotal) * 100).toFixed(2)
              : 0;

            return {
              _attributes: { id: p._id.toString() },
              nombre: p.nombre,
              descripcion: p.descripcion || 'Sin descripción',
              categoria: p.categoria,
              precio: parseFloat(p.precio.toFixed(2)),
              cantidad: p.cantidad,
              valorTotal: parseFloat(valorProducto.toFixed(2)),
              porcentajeValor: parseFloat(porcentajeValor)
            };
          })
        }
      }
    };
    
    res.status(200).json({
      success: true,
      resumen: {
        totalProductos: productos.length,
        cantidadTotal,
        valorTotal: valorTotal.toFixed(2)
      },
      productos: datosGrafico,
      arbolXML: arbolXML  // Agregar el árbol aquí
    });
    
  } catch (error) {
    console.error('Error al obtener datos del informe:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener datos del informe',
      error: error.message
    });
  }
};


/**
 * Generar informe XML completo del inventario
 * Incluye árbol XML estructurado, valor total y porcentajes
 * @route GET /api/productos/informe/xml
 */
exports.generarInformeXML = async (req, res) => {
  try {
    // 1. Obtener todos los productos de la base de datos
    const productos = await Producto.find().sort({ categoria: 1, nombre: 1 });
    
    if (productos.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'No hay productos para generar el informe'
      });
    }
    
    // 2. Calcular totales
    const cantidadTotal = productos.reduce((sum, p) => sum + p.cantidad, 0);
    const valorTotal = productos.reduce((sum, p) => {
      return sum + (p.precio * p.cantidad);
    }, 0);
    
    // 3. Construir estructura JSON que se convertirá a XML
    const informeJSON = {
      _declaration: {
        _attributes: {
          version: '1.0',
          encoding: 'UTF-8'
        }
      },
      informe: {
        _attributes: {
          fecha: new Date().toISOString(),
          tipo: 'Inventario de Productos'
        },
        
        // Resumen con totales
        resumen: {
          totalProductos: {
            _text: productos.length
          },
          cantidadTotal: {
            _attributes: { unidad: 'unidades' },
            _text: cantidadTotal
          },
          valorTotal: {
            _attributes: { moneda: 'USD' },
            _text: valorTotal.toFixed(2)
          }
        },
        
        // Listado de productos con porcentajes
        productos: {
          producto: productos.map(p => {
            const valorProducto = p.precio * p.cantidad;
            
            // Calcular porcentaje del valor total
            const porcentajeValor = valorTotal > 0 
              ? ((valorProducto / valorTotal) * 100).toFixed(2)
              : 0;
            
            // Calcular porcentaje de la cantidad total
            const porcentajeCantidad = cantidadTotal > 0
              ? ((p.cantidad / cantidadTotal) * 100).toFixed(2)
              : 0;
            
            return {
              _attributes: {
                id: p._id.toString()
              },
              nombre: { _text: p.nombre },
              descripcion: { _text: p.descripcion || 'Sin descripción' },
              categoria: { _text: p.categoria },
              precio: {
                _attributes: { moneda: 'USD' },
                _text: p.precio.toFixed(2)
              },
              cantidad: {
                _attributes: { unidad: 'unidades' },
                _text: p.cantidad
              },
              valorTotal: {
                _attributes: { moneda: 'USD' },
                _text: valorProducto.toFixed(2)
              },
              analisis: {
                porcentajeDelValorTotal: {
                  _attributes: { simbolo: '%' },
                  _text: porcentajeValor
                },
                porcentajeDeCantidad: {
                  _attributes: { simbolo: '%' },
                  _text: porcentajeCantidad
                }
              }
            };
          })
        }
      }
    };
    
    // 4. Convertir JSON a XML con formato legible
    const xml = js2xml(informeJSON, {
      compact: true,
      spaces: 2, // Indentación de 2 espacios para legibilidad
      indentAttributes: false
    });
    
    // 5. Configurar headers HTTP para respuesta XML
    res.set({
      'Content-Type': 'application/xml; charset=utf-8',
      'Content-Disposition': 'inline', // Mostrar en navegador, no descargar
      'Cache-Control': 'no-cache'
    });
    
    // 6. Enviar XML como respuesta
    res.status(200).send(xml);
    
  } catch (error) {
    console.error('Error al generar informe XML:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al generar el informe XML',
      error: error.message
    });
  }
};
