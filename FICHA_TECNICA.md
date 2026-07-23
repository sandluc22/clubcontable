# FICHA TÉCNICA — Club Contable: Serie Hábitos Atómicos

## Serie completa — 5 videos (VERSIÓN JORGE)

### Voz definitiva
- **Jorge (es-MX-JorgeNeural)** — Mexicano, masculino, grave, con autoridad ✅

### Formato
- **Resolución:** 1920x1080 (Full HD horizontal)  
- **Duración media:** 4-10 min por video  
- **Estilo:** Imágenes Unsplash + texto en pantalla + narración  
- **Inspiración:** @MindsetTracy-c7b (YouTube)  

### Herramientas

| Herramienta | Uso | Comando |
|---|---|---|
| Edge TTS | Generar voz | `edge-tts --voice es-MX-JorgeNeural --text "..." --write-media audio.mp3` |
| FFmpeg | Montar video | `ffmpeg -loop 1 -i img.jpg -t N -vf "drawtext=text='...':fontfile=DejaVuSans-Bold.ttf" escena.mp4` |
| Unsplash | Imágenes | `curl -sL "https://images.unsplash.com/PHOTO?w=1920&h=1080&fit=crop" -o img.jpg` |
| Concatenación | Unir escenas | `ffmpeg -f concat -safe 0 -i lista.txt -c copy video.mp4` |
| Mezcla audio/video | Sincronizar | `ffmpeg -i video.mp4 -i audio.mp3 -c:v copy -c:a aac -shortest final.mp4` |

### Voces masculinas disponibles (Edge TTS español)
1. **Jorge (MX)** ✅ — Grave, autoridad, tipo Harvey Specter  
2. Lorenzo (CL) — Chileno, narración pausada  
3. Gonzalo (CO) — Colombiano neutro  
4. Tomás (AR) — Argentino  
5. Álvaro (ES) — Español  
6. Darío (ES) — Español alternativo  
7. Marcelo (BO) — Boliviano  
8. Juan (CR) — Costarricense  
9. Manuel (CU) — Cubano  
10. Emilio (DO) — Dominicano  

### Bugs conocidos
1. **Carácter `:` en drawtext** — Usar guiones `-` en lugar de dos puntos  
2. **Fuente DejaVuSans-Bold.ttf** — Instalar `sudo apt-get install fonts-dejavu-extra`  
3. **TTS del chat** — No aplica cambio de voz (bug gateway). Videos sin problema  

### Estructura de archivos
```
clubcontable/videos/
├── guion-video01.md ... guion-video05.md   # Guiones
├── gen_video01.sh    ... gen_video05.sh    # Scripts de montaje
├── ha_imgs01/        ... ha_imgs05/        # Imágenes (no en git)
├── ha_audio01_jorge/ ... ha_audio05_jorge/ # Audios (no en git)  
├── video_habitos_01_jorge.mp4 ... 05       # Videos finales (no en git)
├── FICHA_TECNICA.md                        # Este archivo
├── muestras_voces/                         # Muestras de audio
│   └── todas_harvey/                       # Comparativa con texto Harvey Specter
└── short01_final.mp4                       # Short vertical
```

### Pendiente
- ⏳ Crear canal YouTube "Club Contable"  
- ⏳ Subir los 5 videos  
- ⏳ Crear página Facebook Club Contable  
- ⏳ Buscar voz de doblaje automático alternativa  
- ⏳ Más libros/guiones para nueva serie  
