# Damjan od Resnika

Damjan od Resnika, muzički projekat koji okuplja prijatelje iz kraja i šire.

## TODO

- prepoznaj font sa nalepnica
- organizovati art u podfoldere (albumi, nalepnice...)
- dodati novo:
  obnova-i-izgradnja
  mladifilozof
  noc-pod-nebom-alt

ČIŠĆENJE SLIKA:

magick mystic-girl.jpg -colorspace Gray -contrast-stretch 0%x10% mystic-girl.png
magick poznanja.jpg -colorspace Gray -level 5%,95% -contrast-stretch 0%x5% crtez-print.png
magick poznanja.jpg -colorspace Gray -level 5%,95% -median 3 -contrast-stretch 0%x5% crtez-ujednaceno.png
magick poznanja.jpg -colorspace Gray -white-threshold 88% crtez-cistiji-jako.png
magick noc-pod-nebom.png -colorspace Gray -level 8%,92% -contrast-stretch 0%x3% crtez-print-jako.png
magick devojcica-i-ptice.jpg -colorspace Gray -white-threshold 82% devojcica-i-ptice.png
