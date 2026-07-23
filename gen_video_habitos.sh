#!/bin/bash
# =============================================================================
# SCRIPT BASE para generar videos de la serie Hábitos Atómicos
# Voz: Jorge (es-MX-JorgeNeural)
# Formato: 1920x1080, imágenes Unsplash, texto en pantalla
# =============================================================================
# USO: Copiar y modificar para cada video. Parámetros:
#   N     = número de video (01, 02, 03...)
#   TEXTO = array de textos para cada escena
#   DUR   = array de duraciones en segundos
#   IMG   = array de nombres de imagen
# =============================================================================

FONT_B="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_R="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

generar_video() {
  local N=$1
  local BASE_IMG="videos/ha_imgs0${N}"
  local BASE_AUDIO="videos/ha_audio0${N}_jorge"
  local OUTPUT="videos/video_habitos_0${N}_jorge.mp4"
  local FILES=()
  
  echo "=== Generando Video $N con Jorge ==="
  
  # Aquí se ejecutan las escenas individuales con FFmpeg
  # Cada escena: imagen de fondo + texto + zoom
  # Luego se concatenan y se mezcla con el audio
  
  echo "Video $N generado: $OUTPUT"
}
