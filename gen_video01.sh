#!/bin/bash
# Video 01 - Hábitos Atómicos para Contadores
IMG="videos/ha_imgs01"
AUDIO="videos/ha_audio01_jorge"
FONT_B="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_R="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
OUTPUT="videos/video_habitos_01_jorge.mp4"
echo "=== VIDEO 01 JORGE ==="
for i in 1 2 3 4 5 6; do
  case $i in 1) IMGNAME="v01_intro.jpg" DUR=45 TXT="Habitos Atomicos para Contadores" FSIZE=44 ;;
    2) IMGNAME="v01_bicicleta.jpg" DUR=90 TXT="1% cada dia = 37x mejor al ano" FSIZE=36 ;;
    3) IMGNAME="v01_piramide.jpg" DUR=90 TXT="Los habitos se refuerzan solos" FSIZE=38 ;;
    4) IMGNAME="v01_libreta.jpg" DUR=110 TXT="Las 4 Leyes del Cambio" FSIZE=42 ;;
    5) IMGNAME="v01_exito.jpg" DUR=60 TXT="Nunca dejes de mejorar" FSIZE=44 ;;
    6) IMGNAME="" DUR=25 TXT="" ;; esac
  echo "S${i}..."
done
echo "Usar gen_video_habitos.sh como script base"
