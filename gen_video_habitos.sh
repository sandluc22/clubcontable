#!/bin/bash
# SCRIPT BASE para generar videos de Hábitos Atómicos
# USO: bash gen_video_habitos.sh <NUMERO_VIDEO> <DURACIONES> <IMAGENES>
# Ejemplo: bash gen_video_habitos.sh 01 45,90,90,110,60,25 escritorio,bicicleta,piramide,libreta,exito,outro

N=$1
DURS=$2
IMGS=$3

FONT_B="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_R="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BASE="videos/ha_imgs0${N}"
AUDIO="videos/ha_audio0${N}_jorge"
OUT="videos/video_habitos_0${N}_jorge.mp4"

echo "Generando video ${N} con JORGE..."
# (el script completo de montaje se ejecuta con FFmpeg)
