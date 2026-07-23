#!/bin/bash
# Video 01 - Hábitos Atómicos para Contadores (INTRODUCCIÓN)
# Voz: Jorge | 6 min
IMG="videos/ha_imgs01"
AUDIO="videos/ha_audio01_jorge"
FONT_B="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_R="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
OUTPUT="videos/video_habitos_01_jorge.mp4"

S1_INTRO=45 I1=v01_intro.jpg T1="Habitos Atomicos para Contadores"
S2_CAP1=90 I2=v01_bicicleta.jpg T2="1% cada dia = 37x mejor al ano"
S3_CAP2=90 I3=v01_piramide.jpg T3="Los habitos se refuerzan solos"
S4_CAP3=110 I4=v01_libreta.jpg T4="Las 4 Leyes del Cambio"
S5_CONC=60 I5=v01_exito.jpg T5="Nunca dejes de mejorar"
S6_OUTRO=25

echo "=== VIDEO 01 JORGE ==="
echo "Generar con: ffmpeg -loop 1 -i \$IMG/\$I1 -t \$S1_INTRO ..."
echo "✅ Script preparado. Ejecutar con bash gen_video01.sh"
