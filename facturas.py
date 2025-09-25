import streamlit as st
import pandas as pd
import re
import fitz  # PyMuPDF
import io

# La función principal de análisis es casi la misma, pero ahora procesa archivos en memoria
def analizar_facturas_desde_memoria(lista_pdfs):
    """
    Analiza una lista de archivos PDF subidos por el usuario y extrae los datos.
    """
    lista_articulos = []
    
    for pdf_subido in lista_pdfs:
        nombre_archivo = pdf_subido.name
        print(f"Analizando el archivo: {nombre_archivo}...")
        
        try:
            # Abre el PDF desde los bytes en memoria, no desde una ruta de archivo
            documento = fitz.open(stream=pdf_subido.read(), filetype="pdf")
            
            for pagina in documento:
                texto_pagina = pagina.get_text("text")
                
                if "INVOICE" in texto_pagina and "PACKING LIST" not in texto_pagina:
                    patron = re.compile(
                        r"(\d{1,3}\.\d{3})\n"      # Nº de Línea
                        r"(\d+)\n"                # Cantidad
                        r"\S+\n"                  # Nº de Producto (se ignora)
                        r"([89]\d{7,})\n"         # Código de Mercancía (empieza por 8 o 9)
                        r"([\d.]+)\n"             # Precio Unitario
                        r"([\d,]+\.\d{2})"        # Precio Total
                    )
                    
                    for match in patron.finditer(texto_pagina):
                        try:
                            lista_articulos.append({
                                'Source File': nombre_archivo,
                                'Line No.': match.group(1),
                                'Quantity Shipped': int(match.group(2)),
                                'Commodity Code': match.group(3),
                                'Unit Price': float(match.group(4)),
                                'Total Price': float(match.group(5).replace(',', ''))
                            })
                        except (ValueError, IndexError):
                            continue
            documento.close()
        except Exception as e:
            print(f"  -> Error al procesar el archivo {nombre_archivo}: {e}")
            
    return lista_articulos

# --- Interfaz de la Aplicación Web con Streamlit ---

st.set_page_config(page_title="Analizador de Facturas", layout="centered")

st.title("📄 Analizador de Facturas PDF")
st.write("Sube tus archivos PDF de facturas para extraer un reporte detallado y un resumen por código de mercancía.")

# Botón para subir archivos
archivos_subidos = st.file_uploader(
    "Selecciona tus archivos PDF",
    type="pdf",
    accept_multiple_files=True
)

if archivos_subidos:
    st.info(f"✅ Se han cargado {len(archivos_subidos)} archivos. Procesando...")
    
    # Procesar los archivos subidos
    articulos_extraidos = analizar_facturas_desde_memoria(archivos_subidos)
    
    if articulos_extraidos:
        df = pd.DataFrame(articulos_extraidos)
        st.success("¡Análisis completado!")

        # Preparar el archivo Excel en memoria para la descarga
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            # Pestaña 1: Reporte Detallado
            df_detallado = df.sort_values(by=['Source File', 'Line No.'], ignore_index=True)
            df_detallado.to_excel(writer, sheet_name='Reporte_Detallado', index=False)
            
            # Pestaña 2: Resumen
            df_resumen = df.groupby('Commodity Code').agg({
                'Quantity Shipped': 'sum',
                'Total Price': 'sum'
            }).reset_index()
            df_resumen.to_excel(writer, sheet_name='Resumen_por_Codigo', index=False)
        
        output.seek(0) # Vuelve al inicio del archivo en memoria

        st.header("Resultados")
        st.dataframe(df_resumen)

        # Botón para descargar el Excel generado
        st.download_button(
            label="📥 Descargar Reporte en Excel",
            data=output,
            file_name="Reporte_Facturas.xlsx",
            mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
    else:
        st.error("No se encontraron artículos que cumplan los criterios en los PDFs subidos.")
